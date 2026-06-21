"use server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  client: z.string().optional(),
  platform: z.enum(["ACX", "FINDAWAY", "DIRECT", "PUBLISHER", "OTHER"]).default("ACX"),
  auditionDate: z.string().optional(),
  submittedDate: z.string().optional(),
  rateTerms: z.string().optional(),
  status: z.enum(["SAVED", "SUBMITTED", "SHORTLISTED", "WON", "LOST", "NO_RESPONSE"]).default("SAVED"),
  notes: z.string().optional(),
});

export async function createAudition(input: unknown) {
  const user = await requireUser();
  const data = schema.parse(input);
  const entry = await db.audition.create({
    data: {
      userId: user.id,
      title: data.title,
      author: data.author || null,
      client: data.client || null,
      platform: data.platform,
      auditionDate: data.auditionDate ? new Date(data.auditionDate) : null,
      submittedDate: data.submittedDate ? new Date(data.submittedDate) : null,
      rateTerms: data.rateTerms || null,
      status: data.status,
      notes: data.notes || null,
    },
  });
  revalidatePath("/app/auditions");
  return entry;
}

export async function updateAudition(id: string, input: unknown) {
  const user = await requireUser();
  await db.audition.findFirstOrThrow({ where: { id, userId: user.id } });
  const data = schema.parse(input);
  const entry = await db.audition.update({
    where: { id },
    data: {
      title: data.title,
      author: data.author || null,
      client: data.client || null,
      platform: data.platform,
      auditionDate: data.auditionDate ? new Date(data.auditionDate) : null,
      submittedDate: data.submittedDate ? new Date(data.submittedDate) : null,
      rateTerms: data.rateTerms || null,
      status: data.status,
      notes: data.notes || null,
    },
  });
  revalidatePath("/app/auditions");
  return entry;
}

export async function deleteAudition(id: string) {
  const user = await requireUser();
  await db.audition.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/app/auditions");
}

export async function getAuditions(statusFilter?: string) {
  const user = await requireUser();
  return db.audition.findMany({
    where: {
      userId: user.id,
      ...(statusFilter && statusFilter !== "ALL" ? { status: statusFilter as "SAVED" | "SUBMITTED" | "SHORTLISTED" | "WON" | "LOST" | "NO_RESPONSE" } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}
