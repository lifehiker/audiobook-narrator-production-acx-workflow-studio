"use server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  voiceNotes: z.string().optional(),
  accentNotes: z.string().optional(),
  relationshipNotes: z.string().optional(),
  firstAppearance: z.string().optional(),
  notes: z.string().optional(),
});

async function assertOwnership(projectId: string, userId: string) {
  const project = await db.project.findFirst({ where: { id: projectId, userId } });
  if (!project) throw new Error("Project not found");
}

export async function createCharacter(projectId: string, input: unknown) {
  const user = await requireUser();
  await assertOwnership(projectId, user.id);
  const data = schema.parse(input);
  const entry = await db.characterNote.create({
    data: { projectId, name: data.name, voiceNotes: data.voiceNotes || null, accentNotes: data.accentNotes || null, relationshipNotes: data.relationshipNotes || null, firstAppearance: data.firstAppearance || null, notes: data.notes || null },
  });
  revalidatePath(`/app/projects/${projectId}`);
  return entry;
}

export async function updateCharacter(id: string, projectId: string, input: unknown) {
  const user = await requireUser();
  await assertOwnership(projectId, user.id);
  const data = schema.parse(input);
  const entry = await db.characterNote.update({
    where: { id },
    data: { name: data.name, voiceNotes: data.voiceNotes || null, accentNotes: data.accentNotes || null, relationshipNotes: data.relationshipNotes || null, firstAppearance: data.firstAppearance || null, notes: data.notes || null },
  });
  revalidatePath(`/app/projects/${projectId}`);
  return entry;
}

export async function deleteCharacter(id: string, projectId: string) {
  const user = await requireUser();
  await assertOwnership(projectId, user.id);
  await db.characterNote.delete({ where: { id } });
  revalidatePath(`/app/projects/${projectId}`);
}
