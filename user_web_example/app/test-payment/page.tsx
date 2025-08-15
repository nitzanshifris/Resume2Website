"use client";

import EmbeddedCheckoutModal from "@/components/embedded-checkout-modal";
import { CreditCard, Shield, Zap } from "lucide-react";

export default function TestPaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Test Stripe Payment
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Click the button below to test the embedded checkout experience
          </p>
        </div>

        {/* Test Card Info */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-2" />
              Test Card Details
            </h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  Use these test card numbers:
                </p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <div>
                      <strong>4242 4242 4242 4242</strong> - Successful payment
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <div>
                      <strong>4000 0000 0000 0002</strong> - Card declined
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">!</span>
                    <div>
                      <strong>4000 0025 0000 3155</strong> - Requires authentication
                    </div>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Expiry Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Any future date (e.g., 12/34)
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">CVC</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Any 3 digits (e.g., 123)
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-gray-500 dark:text-gray-400 mb-1">ZIP Code</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Any valid ZIP (e.g., 10001)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Shield className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Secure Checkout
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Powered by Stripe with bank-level encryption
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Zap className="w-10 h-10 text-yellow-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Instant Access
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unlock features immediately after payment
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <CreditCard className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Multiple Cards
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Accept all major credit and debit cards
              </p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="text-center">
          <EmbeddedCheckoutModal 
            amount={999} // $9.99 in cents
            onSuccess={() => {
              console.log("Payment successful!");
            }}
          />
          
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            This is in TEST MODE - no real charges will be made
          </p>
        </div>
      </div>
    </div>
  );
}