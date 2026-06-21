import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stripe = await getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const { priceId } = await req.json();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  let customerId = user?.subscription?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user!.email, name: user!.name ?? undefined });
    customerId = customer.id;
    await db.subscription.upsert({
      where: { userId: session.user.id },
      update: { stripeCustomerId: customerId },
      create: { userId: session.user.id, stripeCustomerId: customerId, plan: "FREE_TRIAL" },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing?canceled=true`,
    subscription_data: { trial_period_days: 14 },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
