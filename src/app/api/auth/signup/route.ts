import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { email, password, name } = result.data;
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);
  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      name: name ?? email.split("@")[0],
      subscription: {
        create: {
          plan: "FREE_TRIAL",
          status: "trialing",
          trialEndsAt: trialEnd,
        },
      },
    },
  });
  return NextResponse.json({ id: user.id, email: user.email });
}
