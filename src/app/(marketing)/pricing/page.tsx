import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const PLANS = [
  {
    name: "Free Trial",
    price: "$0",
    period: "14 days",
    description: "Try everything risk-free",
    features: [
      "2 active projects",
      "Unlimited pronunciations per project",
      "Audition tracker",
      "Invoice management",
      "CSV export",
    ],
    cta: "Start Free Trial",
    ctaHref: "/signup",
    featured: false,
  },
  {
    name: "Solo",
    price: "$19",
    period: "/month",
    description: "For narrators building their pipeline",
    features: [
      "Up to 5 active projects",
      "Unlimited pronunciations",
      "Audition tracker with win rate",
      "Invoice management",
      "CSV export",
      "Email reminders for overdue invoices",
      "Rights reversion date tracking",
    ],
    cta: "Get Solo",
    ctaHref: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For full-time narrators",
    features: [
      "Unlimited active projects",
      "Everything in Solo",
      "Rights reversion alerts (30, 60, 90 days)",
      "Payment due date reminders",
      "Priority support",
    ],
    cta: "Get Pro",
    ctaHref: "/signup",
    featured: true,
  },
  {
    name: "Studio",
    price: "$49",
    period: "/month",
    description: "For studios and power users",
    features: [
      "Everything in Pro",
      "Multiple narrator accounts",
      "Shared project access",
      "Advanced analytics (coming soon)",
      "API access (coming soon)",
      "Dedicated support",
    ],
    cta: "Get Studio",
    ctaHref: "/signup",
    featured: false,
  },
];

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your subscription at any time from your billing page. You'll retain access until the end of your billing period.",
  },
  {
    q: "What counts as an 'active project'?",
    a: "Any project that isn't archived. Once you archive a project, it doesn't count against your limit.",
  },
  {
    q: "Is my data safe if I downgrade?",
    a: "Yes. If you downgrade, your data is preserved. You just won't be able to create new projects above your plan limit.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Annual billing with a discount is coming soon. Sign up for the mailing list to be notified.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards via Stripe. No PayPal at this time.",
  },
];

export default function PricingPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-xl text-gray-600">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 relative flex flex-col ${
                plan.featured
                  ? "border-blue-500 shadow-lg bg-blue-600 text-white ring-2 ring-blue-500"
                  : "bg-white"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs px-3 py-1 rounded-full font-bold">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-4">
                <div className={`text-sm font-medium mb-1 ${plan.featured ? "text-blue-200" : "text-gray-500"}`}>
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.featured ? "text-blue-200" : "text-gray-500"}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mt-1 ${plan.featured ? "text-blue-200" : "text-gray-500"}`}>{plan.description}</p>
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.featured ? "text-blue-200" : "text-green-500"}`} />
                    <span className={plan.featured ? "text-blue-100" : "text-gray-700"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref}>
                <Button
                  className={`w-full ${plan.featured ? "bg-white text-blue-700 hover:bg-blue-50" : ""}`}
                  variant={plan.featured ? "outline" : "default"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border-b pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Link href="/signup">
            <Button>Start your free trial today</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
