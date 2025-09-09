"use client";

import PricingSelector from "@/components/pricing-selector";
import EmbeddedCheckoutModal from "@/components/embedded-checkout-modal";
import { useState } from "react";

export default function TestPricingPage() {
  const [showDirectCheckout, setShowDirectCheckout] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Test Pricing Components</h1>
        
        {/* Test 1: Pricing Selector (shows both plans) */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Option 1: Pricing Selector with Cards</h2>
          <PricingSelector 
            portfolioId="test-portfolio-123"
            onPaymentSuccess={() => {
              console.log("Payment successful!");
              alert("Payment successful! (Test mode)");
            }}
          />
        </div>

        <hr className="my-12 border-gray-300" />

        {/* Test 2: Direct Checkout Modal */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Option 2: Direct Checkout Button</h2>
          <div className="flex gap-4 justify-center">
            <EmbeddedCheckoutModal 
              portfolioId="test-portfolio-123"
              productType="monthly"
              onSuccess={() => {
                console.log("Monthly payment successful!");
              }}
            />
            <EmbeddedCheckoutModal 
              portfolioId="test-portfolio-123"
              productType="lifetime"
              onSuccess={() => {
                console.log("Lifetime payment successful!");
              }}
            />
          </div>
        </div>

        <hr className="my-12 border-gray-300" />

        {/* Test 3: Show the actual checkout modal */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Option 3: Preview Checkout Modal Style</h2>
          <button
            onClick={() => setShowDirectCheckout(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Open Checkout Modal Preview
          </button>
          
          {showDirectCheckout && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl p-6">
                <button
                  onClick={() => setShowDirectCheckout(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
                >
                  ✕
                </button>
                <h3 className="text-2xl font-bold mb-4">Checkout Modal Preview</h3>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 h-96 flex items-center justify-center">
                  <p className="text-gray-500">Stripe Embedded Checkout will appear here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}