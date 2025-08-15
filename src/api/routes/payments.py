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
    price_id: Optional[str] = None  # For subscription/product prices
    amount: Optional[int] = None  # For one-time payments in cents
    mode: str = "payment"  # "payment" for one-time, "subscription" for recurring
    
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

@router.post("/create-checkout-session", response_model=CreateCheckoutSessionResponse)
async def create_checkout_session(request: CreateCheckoutSessionRequest):
    """
    Create an embedded Stripe Checkout Session.
    
    This is the modern way to handle payments - creates an embedded checkout
    that can be displayed directly in your app without redirecting to Stripe.
    """
    try:
        # Validate that Stripe is configured
        if not stripe.api_key:
            logger.error("Stripe API key not configured")
            raise HTTPException(status_code=500, detail="Payment system not configured")
        
        # Build line items based on request
        line_items = []
        
        if request.price_id:
            # Using a pre-configured price from Stripe Dashboard
            line_items.append({
                "price": request.price_id,
                "quantity": 1
            })
        elif request.amount:
            # Creating a one-time price on the fly
            line_items.append({
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": "Portfolio Deployment",
                        "description": "Deploy your portfolio to production"
                    },
                    "unit_amount": request.amount,
                },
                "quantity": 1
            })
        else:
            raise HTTPException(status_code=400, detail="Either price_id or amount must be provided")
        
        # Create the checkout session for embedded mode
        session = stripe.checkout.Session.create(
            ui_mode="embedded",  # This makes it embeddable!
            payment_method_types=["card"],
            line_items=line_items,
            mode=request.mode,
            return_url="http://localhost:3019/payment-return?session_id={CHECKOUT_SESSION_ID}",
        )
        
        logger.info(f"Created checkout session: {session.id}")
        
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