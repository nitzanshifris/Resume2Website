"use client";
import React from "react";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export enum PricingPlan {
  goLive = "go-live",
  getHired = "get-hired",
  turnHeads = "turn-heads",
}

export type Plan = {
  id: string;
  name: string;
  price: number | string;
  subText?: string;
  currency: string;
  features: string[];
  featured?: boolean;
  buttonText?: string;
  additionalFeatures?: string[];
  onClick: () => void;
  limitations?: string[];
  hostingNote?: string;
};

const plans: Array<Plan> = [
  {
    id: PricingPlan.goLive,
    name: "Go Live",
    price: 14.90,
    currency: "$",
    features: [
      "Professional portfolio website",
      "Mobile responsive design",
      "SEO optimized",
      "Basic customization options",
      "Direct deploy to production",
      "1 generation attempt"
    ],
    limitations: [
      "CV2WEB branding included",
      "Limited template customization"
    ],
    buttonText: "Start with Go Live",
    onClick: () => {
      console.log("Go Live selected");
    },
  },
  {
    id: PricingPlan.getHired,
    name: "Get Hired",
    price: 19.90,
    currency: "$",
    featured: true,
    features: [
      "Premium portfolio website",
      "No watermarks or branding",
      "Full template customization",
      "3 generation attempts",
      "Multiple template options",
      "Advanced SEO features",
      "Custom domain ready",
      "First month hosting FREE"
    ],
    buttonText: "Get Hired Now",
    hostingNote: "Then $7.90/month for hosting",
    additionalFeatures: ["Refund available if unsatisfied after 3 tries"],
    onClick: () => {
      console.log("Get Hired selected");
    },
  },
  {
    id: PricingPlan.turnHeads,
    name: "Turn Heads",
    price: 89.90,
    currency: "$",
    features: [
      "Custom designed by top web designers",
      "Recruiter-optimized content",
      "Unlimited revisions",
      "Priority support",
      "Custom animations & interactions",
      "Personal branding consultation",
      "LinkedIn optimization tips",
      "First year hosting FREE",
      "Premium domain assistance"
    ],
    buttonText: "Turn Heads Today",
    hostingNote: "Then $7.90/year for hosting",
    onClick: () => {
      console.log("Turn Heads selected");
    },
  },
];

interface SimplePricingWithThreeTiersProps {
  onSelectPlan?: (planId: string) => void;
}

export function SimplePricingWithThreeTiers({ onSelectPlan }: SimplePricingWithThreeTiersProps) {
  return (
    <div className="relative isolate bg-transparent px-4 py-0 sm:py-10 lg:px-4 max-w-7xl mx-auto">
      <div
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        aria-hidden="true"
      ></div>
      <>
        <h2 className="pt-4 font-bold text-lg md:text-4xl text-center text-neutral-800 dark:text-neutral-100">
          Choose Your Path to Success
        </h2>
        <p className="max-w-md mx-auto text-base text-center text-neutral-600 dark:text-neutral-300 mt-4">
          Transform your CV into a stunning portfolio website that gets you noticed and hired
        </p>
      </>

      <div
        className={cn(
          "mx-auto grid grid-cols-1 gap-4 mt-20",
          "max-w-7xl mx-auto md:grid-cols-2 xl:grid-cols-3"
        )}
      >
        {plans.map((tier) => {
          return (
            <Card 
              plan={tier} 
              key={tier.id} 
              onClick={() => {
                tier.onClick();
                if (onSelectPlan) {
                  onSelectPlan(tier.id);
                }
              }} 
            />
          );
        })}
      </div>
    </div>
  );
}

const Card = ({ plan, onClick }: { plan: Plan; onClick: () => void }) => {
  return (
    <div
      className={cn(
        "p-1 sm:p-4 md:p-4 rounded-3xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800",
        plan.featured && "scale-105 border-2 border-sky-500 dark:border-sky-400"
      )}
    >
      <div className="flex flex-col gap-4 h-full justify-start">
        <div
          className={cn(
            "p-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-input w-full dark:shadow-[0px_-1px_0px_0px_var(--neutral-700)]"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-2 flex-col">
              <p
                className={cn("font-medium text-lg text-black dark:text-white")}
              >
                {plan.name}
              </p>
            </div>

            {plan.featured && (
              <div
                className={cn(
                  "font-medium text-xs px-3 py-1 rounded-full relative bg-neutral-900 dark:bg-white dark:text-black text-white"
                )}
              >
                <div className="absolute inset-x-0 bottom-0 w-3/4 mx-auto h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                Most Popular
              </div>
            )}
          </div>
          <div className="mt-8">
            <div className="flex items-end">
              <span
                className={cn(
                  "text-lg font-bold text-neutral-500 dark:text-neutral-200"
                )}
              >
                {plan.currency}
              </span>
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    "text-3xl md:text-7xl font-bold dark:text-neutral-50 text-neutral-800"
                  )}
                >
                  {plan?.price}
                </span>
              </div>
              <span
                className={cn(
                  "text-base font-normal text-neutral-500 dark:text-neutral-200 mb-1 md:mb-2"
                )}
              >
                {plan.subText || "/one-time"}
              </span>
            </div>
            {plan.hostingNote && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                {plan.hostingNote}
              </p>
            )}
          </div>
          <button
            className={cn(
              "w-full md:w-full mt-10 mb-4 px-2 py-2 rounded-lg bg-gradient-to-b from-sky-500 to-sky-600 text-white font-medium transition-all hover:from-sky-600 hover:to-sky-700",
              plan.featured && "from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800"
            )}
            onClick={onClick}
          >
            {plan.buttonText}
          </button>
        </div>
        <div className="mt-1 p-4">
          {plan.features.map((feature, idx) => (
            <Step key={idx}>{feature}</Step>
          ))}
        </div>
        {plan.limitations && plan.limitations.length > 0 && (
          <>
            <Divider />
            <div className="p-4">
              {plan.limitations.map((limitation, idx) => (
                <Step key={idx} limitation>
                  {limitation}
                </Step>
              ))}
            </div>
          </>
        )}
        {plan.additionalFeatures && plan.additionalFeatures.length > 0 && (
          <>
            {!plan.limitations && <Divider />}
            <div className="p-4">
              {plan.additionalFeatures?.map((feature, idx) => (
                <Step additional key={idx}>
                  {feature}
                </Step>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Step = ({
  children,
  additional,
  limitation,
}: {
  children: React.ReactNode;
  additional?: boolean;
  limitation?: boolean;
}) => {
  return (
    <div className="flex items-start justify-start gap-2 my-4">
      <div
        className={cn(
          "h-4 w-4 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-0.5",
          additional && "bg-sky-500",
          limitation && "bg-red-500"
        )}
      >
        <IconCheck className="h-3 w-3 [stroke-width:4px] text-neutral-300" />
      </div>
      <div className={cn(
        "font-medium text-black text-sm dark:text-white",
        limitation && "text-neutral-600 dark:text-neutral-400"
      )}>
        {children}
      </div>
    </div>
  );
};

const Divider = () => {
  return (
    <div className="relative">
      <div className={cn("w-full h-px dark:bg-neutral-950 bg-white")} />
      <div className={cn("w-full h-px bg-neutral-200 dark:bg-neutral-800")} />
      <div
        className={cn(
          "absolute inset-0 h-5 w-5 m-auto rounded-xl dark:bg-neutral-800 bg-white shadow-[0px_-1px_0px_0px_var(--neutral-200)] dark:shadow-[0px_-1px_0px_0px_var(--neutral-700)] flex items-center justify-center"
        )}
      >
        <IconPlus
          className={cn(
            "h-3 w-3 [stroke-width:4px] dark:text-neutral-300 text-black"
          )}
        />
      </div>
    </div>
  );
};

export default SimplePricingWithThreeTiers;