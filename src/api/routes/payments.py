"""
Stripe Payment Processing Routes
Handles payment intents, subscriptions, and payment verification
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict
import stripe
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api/v1/payments",
    tags=["payments"]
)

class CreateCheckoutSessionRequest(BaseModel):
    """Request model for creating embedded checkout session"""
    product_type: str  # "monthly" or "lifetime"
    portfolio_id: Optional[str] = None  # Track which portfolio this payment is for
    user_email: Optional[str] = None  # Pre-fill customer email
    
class CreateCheckoutSessionResponse(BaseModel):
    """Response model for checkout session creation"""
    session_id: str
    client_secret: str

class CreatePaymentIntentRequest(BaseModel):
    """Request model for creating payment intent (legacy)"""
    amount: int  # Amount in cents (e.g., 1000 = $10.00)
    currency: str = "usd"
    description: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None

class CreatePaymentIntentResponse(BaseModel):
    """Response model for payment intent creation (legacy)"""
    client_secret: str
    payment_intent_id: str
    amount: int
    currency: str

# Add these price IDs at the module level (replace with your actual price IDs from Stripe)
# IMPORTANT: These must be TEST mode price IDs when using test API keys
STRIPE_PRICE_IDS = {
    "monthly_recurring": "price_TEST_MONTHLY_RECURRING",  # Replace with TEST mode $8/month price ID
    "monthly_setup": "price_TEST_MONTHLY_SETUP",          # Replace with TEST mode $32 setup fee price ID  
    "lifetime": "price_TEST_LIFETIME"                     # Replace with TEST mode $150 lifetime price ID
}

# For development/testing, use dynamic pricing if price IDs not set
USE_DYNAMIC_PRICING = True  # Set to False when you have real TEST mode price IDs

@router.post("/create-checkout-session", response_model=CreateCheckoutSessionResponse)
async def create_checkout_session(request: CreateCheckoutSessionRequest):
    """
    Create an embedded Stripe Checkout Session for portfolio payment.
    
    Supports two product types:
    - monthly: $32 setup + $8/month subscription
    - lifetime: $150 one-time payment
    """
    try:
        # Validate that Stripe is configured
        if not stripe.api_key:
            logger.error("Stripe API key not configured")
            raise HTTPException(status_code=500, detail="Payment system not configured")
        
        # Build line items based on product type
        line_items = []
        checkout_mode = "payment"  # Default for one-time payments
        
        if USE_DYNAMIC_PRICING:
            # Use dynamic pricing for testing (creates prices on the fly)
            if request.product_type == "monthly":
                # For monthly, we need to create a one-time payment combining both fees
                # Since dynamic pricing doesn't support subscriptions with setup fees easily
                line_items.append({
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": "Portfolio Hosting - First Month",
                            "description": "Initial setup ($32) + First month hosting ($8)"
                        },
                        "unit_amount": 4000,  # $40.00 in cents
                    },
                    "quantity": 1
                })
                checkout_mode = "payment"
                logger.warning("Using dynamic pricing for testing - monthly shown as one-time $40")
                
            elif request.product_type == "lifetime":
                line_items.append({
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": "Portfolio Hosting - Lifetime Access",
                            "description": "One-time payment for lifetime hosting"
                        },
                        "unit_amount": 15000,  # $150.00 in cents
                    },
                    "quantity": 1
                })
                checkout_mode = "payment"
        else:
            # Use real Stripe price IDs from dashboard
            if request.product_type == "monthly":
                # Monthly subscription with setup fee
                # Add the recurring subscription
                line_items.append({
                    "price": STRIPE_PRICE_IDS["monthly_recurring"],
                    "quantity": 1
                })
                # Add the one-time setup fee
                line_items.append({
                    "price": STRIPE_PRICE_IDS["monthly_setup"],
                    "quantity": 1
                })
                checkout_mode = "subscription"
                
            elif request.product_type == "lifetime":
                # Lifetime one-time payment
                line_items.append({
                    "price": STRIPE_PRICE_IDS["lifetime"],
                    "quantity": 1
                })
                checkout_mode = "payment"
        
        if not line_items:
            raise HTTPException(
                status_code=400, 
                detail="Invalid product_type. Must be 'monthly' or 'lifetime'"
            )
        
        # Prepare session parameters
        session_params = {
            "ui_mode": "embedded",  # Embedded checkout
            "payment_method_types": ["card"],
            "line_items": line_items,
            "mode": checkout_mode,
            "return_url": "http://localhost:3019/payment-return?session_id={CHECKOUT_SESSION_ID}",
        }
        
        # Add customer email if provided
        if request.user_email:
            session_params["customer_email"] = request.user_email
            
        # Add metadata to track the portfolio
        if request.portfolio_id:
            session_params["metadata"] = {
                "portfolio_id": request.portfolio_id,
                "product_type": request.product_type
            }
        
        # Create the checkout session
        session = stripe.checkout.Session.create(**session_params)
        
        logger.info(f"Created {request.product_type} checkout session: {session.id}")
        
        return CreateCheckoutSessionResponse(
            session_id=session.id,
            client_secret=session.client_secret
        )
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error creating checkout session: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")

@router.get("/session-status/{session_id}")
async def get_session_status(session_id: str):
    """
    Retrieve the status of a checkout session.
    Used after payment to confirm success.
    """
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        
        return {
            "status": session.status,
            "payment_status": session.payment_status,
            "customer_email": session.customer_details.email if session.customer_details else None,
            "amount_total": session.amount_total,
            "currency": session.currency
        }
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error retrieving session: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving session: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve session")

@router.post("/create-payment-intent")
async def create_payment_intent(request: CreatePaymentIntentRequest):
    """
    Create a Stripe Payment Intent for the client to complete payment.
    
    This endpoint creates a payment intent that the frontend will use
    with Stripe Elements to collect payment details.
    """
    try:
        # Validate that Stripe is configured
        if not stripe.api_key:
            logger.error("Stripe API key not configured")
            raise HTTPException(status_code=500, detail="Payment system not configured")
        
        # Create the payment intent
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
            description=request.description,
            metadata=request.metadata or {},
            automatic_payment_methods={
                "enabled": True,
            },
        )
        
        logger.info(f"Created payment intent: {intent.id} for amount: {request.amount}")
        
        return CreatePaymentIntentResponse(
            client_secret=intent.client_secret,
            payment_intent_id=intent.id,
            amount=intent.amount,
            currency=intent.currency
        )
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error creating payment intent: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create payment intent")

@router.post("/confirm-payment")
async def confirm_payment(payment_intent_id: str):
    """
    Confirm that a payment was successful by checking with Stripe.
    
    This endpoint verifies the payment status after the client completes
    the payment process.
    """
    try:
        # Retrieve the payment intent from Stripe
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if intent.status == "succeeded":
            logger.info(f"Payment confirmed for intent: {payment_intent_id}")
            
            # TODO: Here you would typically:
            # 1. Update user's subscription status in database
            # 2. Enable premium features
            # 3. Send confirmation email
            
            return {
                "status": "success",
                "payment_intent_id": payment_intent_id,
                "amount": intent.amount,
                "currency": intent.currency
            }
        else:
            logger.warning(f"Payment not successful. Status: {intent.status}")
            return {
                "status": intent.status,
                "payment_intent_id": payment_intent_id,
                "message": "Payment not completed"
            }
            
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error confirming payment: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error confirming payment: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to confirm payment")

# Webhook endpoint for Stripe events (optional but recommended)
@router.post("/webhook")
async def stripe_webhook(request: dict):
    """
    Handle Stripe webhook events.
    
    This endpoint receives events from Stripe when payment status changes.
    You'll need to configure this URL in your Stripe dashboard.
    """
    # TODO: Implement webhook signature verification
    # TODO: Handle different event types (payment_intent.succeeded, etc.)
    
    logger.info(f"Received Stripe webhook: {request.get('type', 'unknown')}")
    
    return {"status": "received"}