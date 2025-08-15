"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function TestStripeLoad() {
  const [stripeStatus, setStripeStatus] = useState<string>("Loading...");
  const [stripeV3Status, setStripeV3Status] = useState<string>("Not loaded");

  useEffect(() => {
    // Test if we can load Stripe via dynamic import
    import("@stripe/stripe-js")
      .then(({ loadStripe }) => {
        const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!key) {
          setStripeStatus("❌ No Stripe key found in environment");
          return;
        }
        setStripeStatus(`✅ Module loaded, attempting to initialize with key: ${key.substring(0, 20)}...`);
        
        return loadStripe(key);
      })
      .then((stripe) => {
        if (stripe) {
          setStripeStatus("✅ Stripe loaded successfully!");
        } else if (stripe === null) {
          setStripeStatus("⚠️ Stripe loaded but returned null (check key)");
        }
      })
      .catch((error) => {
        setStripeStatus(`❌ Error: ${error.message}`);
        console.error("Stripe loading error:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Stripe.js Loading Test
        </h1>

        <div className="space-y-6">
          {/* Test 1: Module Import */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Test 1: @stripe/stripe-js Module
            </h2>
            <p className="font-mono text-sm">{stripeStatus}</p>
          </div>

          {/* Test 2: Direct Script Load */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Test 2: Direct Script Tag
            </h2>
            <p className="font-mono text-sm">{stripeV3Status}</p>
            <Script
              src="https://js.stripe.com/v3/"
              onLoad={() => {
                setStripeV3Status("✅ Stripe v3 script loaded!");
                // @ts-ignore
                if (window.Stripe) {
                  setStripeV3Status("✅ Stripe v3 loaded and window.Stripe is available!");
                }
              }}
              onError={(e) => {
                setStripeV3Status(`❌ Failed to load Stripe v3 script: ${e}`);
              }}
            />
          </div>

          {/* Test 3: Network Check */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Test 3: Direct Network Test
            </h2>
            <button
              onClick={() => {
                fetch("https://js.stripe.com/v3/")
                  .then(response => {
                    if (response.ok) {
                      alert("✅ Can reach Stripe servers!");
                    } else {
                      alert(`⚠️ Stripe returned status: ${response.status}`);
                    }
                  })
                  .catch(error => {
                    alert(`❌ Cannot reach Stripe: ${error.message}`);
                  });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Network Connection to Stripe
            </button>
          </div>

          {/* Environment Variables */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Environment Check
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Publishable Key:</strong>{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                    ? `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 20)}...`
                    : "NOT FOUND"}
                </code>
              </p>
              <p>
                <strong>Node Env:</strong>{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {process.env.NODE_ENV}
                </code>
              </p>
            </div>
          </div>

          {/* Browser Console Instructions */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-yellow-800 dark:text-yellow-200">
              Check Browser Console
            </h2>
            <p className="text-yellow-700 dark:text-yellow-300">
              Open your browser's developer console (F12) to see detailed error messages.
              Look for any Content Security Policy (CSP) errors or network errors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}