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
    <div className="w-full max-w-4xl mx-auto p-6 relative">
      {/* Background gradient similar to homepage */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-emerald-500/5 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-sky-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
          Choose Your Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Deploy your portfolio to the web with our reliable hosting
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-6 transition-all cursor-pointer backdrop-blur-sm ${
              selectedPlan === plan.id
                ? "ring-2 ring-sky-500 bg-gradient-to-br from-blue-50 via-sky-50/50 to-emerald-50/30 dark:from-blue-950/30 dark:via-sky-950/20 dark:to-emerald-950/10 shadow-xl"
                : "bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-lg"
            } ${plan.highlighted ? "shadow-xl scale-105" : ""}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
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
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedPlan === plan.id
                  ? "border-sky-500 bg-gradient-to-br from-blue-500 to-emerald-500 shadow-md"
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
                  <Check className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
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