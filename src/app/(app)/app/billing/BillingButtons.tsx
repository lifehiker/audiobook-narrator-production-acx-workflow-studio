"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BillingButtonsProps {
  hasCustomer: boolean;
  planId?: string;
  currentPlan?: string | null;
}

const PRICE_IDS: Record<string, string> = {
  SOLO: process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO ?? "",
  PRO: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? "",
  STUDIO: process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDIO ?? "",
};

export function BillingButtons({ hasCustomer, planId, currentPlan }: BillingButtonsProps) {
  const [loading, setLoading] = useState(false);

  // Manage subscription button (no planId = top-level button)
  if (!planId) {
    if (!hasCustomer) return null;
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const res = await fetch("/api/stripe/portal", { method: "POST" });
          const { url } = await res.json();
          if (url) window.location.href = url;
          else setLoading(false);
        }}
      >
        {loading ? "Loading..." : "Manage Subscription"}
      </Button>
    );
  }

  // Upgrade button for plan cards
  if (currentPlan === planId) {
    return (
      <Button variant="outline" className="w-full" disabled>
        Current Plan
      </Button>
    );
  }

  const priceId = PRICE_IDS[planId];

  const handleUpgrade = async () => {
    if (!priceId) {
      alert("Stripe is not configured yet. Add your Stripe price IDs to enable subscriptions.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error ?? "Failed to start checkout");
      setLoading(false);
    }
  };

  return (
    <Button className="w-full" disabled={loading} onClick={handleUpgrade}>
      {loading ? "Loading..." : `Upgrade to ${planId}`}
    </Button>
  );
}
