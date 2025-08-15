"use client";

import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues
const EmbeddedCheckoutButton = dynamic(
  () => import("@/components/EmbeddedCheckoutForm"),
  { 
    ssr: false,
    loading: () => <p>Loading payment system...</p>
  }
);

export default function TestCheckoutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Test Stripe Embedded Checkout</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mb-8">
          <p className="text-gray-600 mb-4">
            This uses the exact implementation from Fireship's tutorial
          </p>
          
          <div className="bg-blue-50 p-4 rounded mb-4">
            <p className="text-sm text-blue-800 font-semibold mb-2">Test Card:</p>
            <p className="font-mono">4242 4242 4242 4242</p>
            <p className="text-xs text-blue-600 mt-1">Exp: 12/34, CVC: 123</p>
          </div>
          
          <EmbeddedCheckoutButton />
        </div>
        
        <p className="text-sm text-gray-500">
          If you see an error, check browser console (F12) for details
        </p>
      </div>
    </div>
  );
}