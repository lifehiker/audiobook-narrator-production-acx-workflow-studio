"use server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  chapter: z.string().optional(),
  location: z.string().optional(),
  issueType: z.enum(["MISREAD", "PRONUNCIATION", "NOISE", "PACING", "MISSING_LINE", "OTHER"]).default("MISREAD"),
  originalText: z.string().optional(),
  correctedText: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["OPEN", "RECORDED", "SENT", "APPROVED"]).default("OPEN"),
});

async function assertOwnership(projectId: string, userId: string) {
  const project = await db.project.findFirst({ where: { id: projectId, userId } });
  if (!project) throw new Error("Project not found");
}

export async function createPickup(projectId: string, input: unknown) {
  const user = await requireUser();
  await assertOwnership(projectId, user.id);
  const data = schema.parse(input);
  const entry = await db.pickupNote.create({
    data: { projectId, chapter: data.chapter || null, location: data.location || null, issueType: data.issueType, originalText: data.originalText || null, correctedText: data.correctedText || null, notes: data.notes || null, status: data.status },
  });
  revalidatePath(`/app/projects/${projectId}`);
  return entry;
}

export async function updatePickup(id: string, projectId: string, input: unknown) {
  const user = await requireUser();
  await assertOwnership(projectId, user.id);
  const data = schema.parse(input);
  const entry = await db.pickupNote.update({
    where: { id },
    data: { chapter: data.chapter || null, location: data.location || null, issueType: data.issueType, originalText: data.originalText || null, correctedText: data.correctedText || null, notes: data.notes || null, status: data.status },
  });
  revalidatePath(`/app/projects/${projectId}`);
  return entry;
}

export async function deletePickup(id: string, projectId: string) {
  const user = await requireUser();
  await assertOwnership(projectId, user.id);
  await db.pickupNote.delete({ where: { id } });
  revalidatePath(`/app/projects/${projectId}`);
}
