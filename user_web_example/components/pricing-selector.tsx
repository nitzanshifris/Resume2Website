"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import EmbeddedCheckoutModal from "./embedded-checkout-modal";

interface PricingSelectorProps {
  portfolioId?: string;
  onPaymentSuccess?: () => void;
}

export default function PricingSelector({ portfolioId, onPaymentSuccess }: PricingSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime" | null>(null);

  const plans = [
    {
      id: "monthly" as const,
      name: "Monthly Plan",
      price: "$40",
      period: "then $8/month",
      description: "Perfect for trying out our service",
      features: [
        "Professional portfolio website",
        "Custom domain support",
        "SSL certificate included",
        "Monthly hosting & maintenance",
        "Cancel anytime",
        "Email support"
      ],
      highlighted: false
    },
    {
      id: "lifetime" as const,
      name: "Lifetime Access",
      price: "$150",
      period: "one-time payment",
      description: "Best value for professionals",
      features: [
        "Everything in Monthly Plan",
        "Lifetime hosting included",
        "Priority support",
        "Future features included",
        "No recurring fees ever",
        "Save 68% vs monthly"
      ],
      highlighted: true,
      badge: "BEST VALUE"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Deploy your portfolio to the web with our reliable hosting
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-6 transition-all cursor-pointer ${
              selectedPlan === plan.id
                ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            } ${plan.highlighted ? "shadow-lg" : ""}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === plan.id
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}>
                {selectedPlan === plan.id && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                {plan.period}
              </span>
            </div>

            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="flex justify-center">
          <EmbeddedCheckoutModal
            portfolioId={portfolioId}
            productType={selectedPlan}
            onSuccess={onPaymentSuccess}
          />
        </div>
      )}
    </div>
  );
}