import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

const PLAN_MAP: Record<string, "SOLO" | "PRO" | "STUDIO"> = {
  [process.env.STRIPE_PRICE_SOLO ?? ""]: "SOLO",
  [process.env.STRIPE_PRICE_PRO ?? ""]: "PRO",
  [process.env.STRIPE_PRICE_STUDIO ?? ""]: "STUDIO",
};

type StripeCheckoutSessionPayload = {
  customer?: string | null;
};

type StripeSubscriptionPayload = {
  id: string;
  customer?: string | null;
  status: string;
  current_period_end?: number;
  items?: {
    data?: Array<{
      price?: {
        id?: string;
      };
    }>;
  };
};

export async function POST(req: NextRequest) {
  const stripe = await getStripe();
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as StripeCheckoutSessionPayload;
    const customerId = session.customer as string;
    const sub = await db.subscription.findFirst({ where: { stripeCustomerId: customerId } });
    if (sub) {
      await db.subscription.update({ where: { id: sub.id }, data: { status: "active" } });
    }
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const stripeSub = event.data.object as StripeSubscriptionPayload;
    const customerId = stripeSub.customer as string;
    const priceId = stripeSub.items?.data?.[0]?.price?.id;
    const plan = PLAN_MAP[priceId ?? ""] ?? "PRO";
    const currentPeriodEnd = stripeSub.current_period_end
      ? new Date(stripeSub.current_period_end * 1000)
      : null;
    const sub = await db.subscription.findFirst({ where: { stripeCustomerId: customerId } });
    if (sub) {
      await db.subscription.update({
        where: { id: sub.id },
        data: {
          stripeSubscriptionId: stripeSub.id,
          stripePriceId: priceId,
          plan,
          status: stripeSub.status,
          stripeCurrentPeriodEnd: currentPeriodEnd,
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const stripeSub = event.data.object as StripeSubscriptionPayload;
    const customerId = stripeSub.customer as string;
    const sub = await db.subscription.findFirst({ where: { stripeCustomerId: customerId } });
    if (sub) {
      await db.subscription.update({ where: { id: sub.id }, data: { plan: "FREE_TRIAL", status: "canceled" } });
    }
  }

  return NextResponse.json({ received: true });
}
