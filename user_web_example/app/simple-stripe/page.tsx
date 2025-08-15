"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Stripe: any;
  }
}

export default function SimpleStripePage() {
  const [stripeStatus, setStripeStatus] = useState("Loading Stripe...");
  const [stripe, setStripe] = useState<any>(null);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Stripe Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <p>Status: {stripeStatus}</p>
        </div>

        <Script
          src="https://js.stripe.com/v3/"
          onLoad={() => {
            console.log("Stripe script loaded!");
            if (typeof window !== "undefined" && window.Stripe) {
              setStripeStatus("✅ Stripe loaded successfully!");
              const stripeInstance = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
              setStripe(stripeInstance);
              console.log("Stripe instance created:", stripeInstance);
            } else {
              setStripeStatus("❌ Stripe loaded but window.Stripe not available");
            }
          }}
          onError={() => {
            setStripeStatus("❌ Failed to load Stripe script");
            console.error("Failed to load Stripe");
          }}
        />

        {stripe && (
          <button
            onClick={async () => {
              try {
                // Test creating a checkout session
                const response = await fetch("http://localhost:2000/api/v1/payments/create-checkout-session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ amount: 999, mode: "payment" })
                });
                
                const data = await response.json();
                console.log("Session created:", data);
                
                alert(`Session created! ID: ${data.session_id}`);
              } catch (error) {
                console.error("Error:", error);
                alert(`Error: ${error}`);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Create Session
          </button>
        )}

        <div className="mt-8 p-4 bg-yellow-100 rounded">
          <p className="font-semibold">Troubleshooting:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Check if you have ad blockers or privacy extensions</li>
            <li>Try incognito/private browsing mode</li>
            <li>Check browser console for errors (F12)</li>
            <li>Try a different browser</li>
          </ul>
        </div>
      </div>
    </div>
  );
}