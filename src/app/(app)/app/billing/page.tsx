import { requireUser } from "@/lib/auth";
import { PlanBadge } from "@/components/app/PlanBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { BillingButtons } from "./BillingButtons";
import { format } from "date-fns";

const PLANS = [
  {
    id: "SOLO",
    name: "Solo",
    price: "$19",
    period: "/month",
    description: "For narrators building their pipeline",
    features: ["Up to 5 active projects", "Unlimited pronunciations", "Audition tracker", "Invoice management", "CSV export", "Email reminders"],
    priceEnv: "NEXT_PUBLIC_STRIPE_PRICE_SOLO",
  },
  {
    id: "PRO",
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For full-time narrators",
    features: ["Unlimited projects", "Everything in Solo", "Rights reversion alerts", "Priority support"],
    priceEnv: "NEXT_PUBLIC_STRIPE_PRICE_PRO",
    popular: true,
  },
  {
    id: "STUDIO",
    name: "Studio",
    price: "$49",
    period: "/month",
    description: "For studios and power users",
    features: ["Everything in Pro", "Multiple narrator accounts", "Advanced analytics", "API access (coming soon)"],
    priceEnv: "NEXT_PUBLIC_STRIPE_PRICE_STUDIO",
  },
];

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const sub = user.subscription;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your subscription and billing details.</p>
      </div>

      {params.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          Subscription activated! Welcome to the next level.
        </div>
      )}
      {params.canceled && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg px-4 py-3 text-sm">
          Checkout was canceled. Your current plan remains unchanged.
        </div>
      )}

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PlanBadge plan={sub?.plan ?? null} />
              <div>
                <div className="font-medium">
                  {sub?.plan === "FREE_TRIAL" ? "Free Trial" : sub?.plan}
                </div>
                {sub?.trialEndsAt && sub.plan === "FREE_TRIAL" && (
                  <div className="text-xs text-gray-500">
                    Trial ends {format(new Date(sub.trialEndsAt), "MMMM d, yyyy")}
                  </div>
                )}
                {sub?.stripeCurrentPeriodEnd && sub.plan !== "FREE_TRIAL" && (
                  <div className="text-xs text-gray-500">
                    Renews {format(new Date(sub.stripeCurrentPeriodEnd), "MMMM d, yyyy")}
                  </div>
                )}
              </div>
            </div>
            <BillingButtons hasCustomer={!!sub?.stripeCustomerId} />
          </div>
        </CardContent>
      </Card>

      {/* Plan Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? "border-blue-500 shadow-md" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </CardTitle>
                <div className="font-semibold text-lg">{plan.name}</div>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <BillingButtons
                  hasCustomer={!!sub?.stripeCustomerId}
                  planId={plan.id}
                  currentPlan={sub?.plan}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
