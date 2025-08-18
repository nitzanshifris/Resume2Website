"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCallback, useRef, useState, useEffect } from "react";
import { X } from "lucide-react";

interface EmbeddedCheckoutModalProps {
  portfolioId?: string;
  productType?: "monthly" | "lifetime"; // Which product to purchase
  onSuccess?: () => void;
}

// Initialize Stripe outside of component to prevent re-initialization
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function EmbeddedCheckoutModal({ 
  portfolioId, 
  productType = "monthly", // Default to monthly plan
  onSuccess 
}: EmbeddedCheckoutModalProps) {
  useEffect(() => {
    if (!stripePromise) {
      setError('Payment system not configured. Please check your Stripe configuration.');
    }
  }, []);
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session with our backend
    return fetch("http://localhost:2000/api/v1/payments/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        product_type: productType, // "monthly" or "lifetime"
        portfolio_id: portfolioId,
        // TODO: Add user_email if available from auth context
      }),
    })
      .then((res) => res.json())
      .then((data) => data.client_secret);
  }, [productType, portfolioId]);

  const options = { fetchClientSecret };

  const handleCheckoutClick = () => {
    setShowCheckout(true);
  };

  const handleCloseModal = () => {
    setShowCheckout(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={handleCheckoutClick}
        className="px-8 py-4 bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-lg"
      >
        {productType === "monthly" 
          ? "Go Live - $40 + $8/month" 
          : "Go Live - $150 Lifetime"}
      </button>

      {/* Modal Overlay */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp border border-sky-200 dark:border-sky-900">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-sky-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 via-sky-50 to-emerald-50 dark:from-gray-900 dark:to-gray-900">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                  Complete Your Purchase
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Secure payment powered by Stripe
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Checkout Form */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {error ? (
                <div className="text-center py-20">
                  <div className="text-red-500 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-900 dark:text-white font-semibold mb-2">Error Loading Checkout</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
                </div>
              ) : (
                <EmbeddedCheckoutProvider 
                  stripe={stripePromise} 
                  options={options}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add animations to global CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}