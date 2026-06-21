"use server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  term: z.string().min(1),
  phonetic: z.string().optional(),
  category: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["NEEDS_RESEARCH", "CONFIRMED", "RECORDED"]).default("NEEDS_RESEARCH"),
});

async function assertOwnership(projectId: string, userId: string) {
  const project = await db.project.findFirst({ where: { id: projectId, userId } });
  if (!project) throw new Error("Project not found");
}

export async function createPronunciation(projectId: string, input: unknown) {
  const user = await requireUser();
  await assertOwnership(projectId, user.id);
  const data = schema.parse(input);
  const entry = await db.pronunciationEntry.create({
    data: { projectId, ...data, phonetic: data.phonetic || null, category: data.category || null, source: data.source || null, notes: data.notes || null },
  });
  revalidatePath(`/app/projects/${projectId}`);
  return entry;
}

export async function updatePronunciation(id: string, projectId: string, input: unknown) {
  const user = await requireUser();
  await assertOwnership(projectId, user.id);
  const data = schema.parse(input);
  const entry = await db.pronunciationEntry.update({
    where: { id },
    data: { ...data, phonetic: data.phonetic || null, category: data.category || null, source: data.source || null, notes: data.notes || null },
  });
  revalidatePath(`/app/projects/${projectId}`);
  return entry;
}

export async function deletePronunciation(id: string, projectId: string) {
  const user = await requireUser();
  await assertOwnership(projectId, user.id);
  await db.pronunciationEntry.delete({ where: { id } });
  revalidatePath(`/app/projects/${projectId}`);
}
