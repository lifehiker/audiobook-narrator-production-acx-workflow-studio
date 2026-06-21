"use server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projectSchema } from "@/lib/validations/project";
import { canCreateProject } from "@/lib/limits";
import { revalidatePath } from "next/cache";

export async function createProject(input: unknown) {
  const user = await requireUser();
  const data = projectSchema.parse(input);

  // Check plan limits
  const activeCount = await db.project.count({
    where: { userId: user.id, status: { not: "ARCHIVED" } },
  });
  if (!canCreateProject(user.subscription?.plan ?? null, activeCount)) {
    throw new Error("You have reached your plan's project limit. Please upgrade.");
  }

  const project = await db.project.create({
    data: {
      userId: user.id,
      title: data.title,
      author: data.author || null,
      clientPublisher: data.clientPublisher || null,
      platform: data.platform,
      contractType: data.contractType,
      status: data.status,
      wordCount: data.wordCount ? Number(data.wordCount) : null,
      estimatedHours: data.estimatedHours ? Number(data.estimatedHours) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      notes: data.notes || null,
      pfhRate: data.pfhRate ? Number(data.pfhRate) : null,
      royaltyShareType: data.royaltyShareType || null,
      contractDate: data.contractDate ? new Date(data.contractDate) : null,
      expectedPayment: data.expectedPayment ? Number(data.expectedPayment) : null,
      paymentDueDate: data.paymentDueDate ? new Date(data.paymentDueDate) : null,
      rightsReversionDate: data.rightsReversionDate ? new Date(data.rightsReversionDate) : null,
      royaltyNotes: data.royaltyNotes || null,
    },
  });

  revalidatePath("/app/projects");
  return project;
}

export async function updateProject(projectId: string, input: unknown) {
  const user = await requireUser();
  const data = projectSchema.parse(input);

  const existing = await db.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!existing) throw new Error("Project not found");

  const project = await db.project.update({
    where: { id: projectId },
    data: {
      title: data.title,
      author: data.author || null,
      clientPublisher: data.clientPublisher || null,
      platform: data.platform,
      contractType: data.contractType,
      status: data.status,
      wordCount: data.wordCount ? Number(data.wordCount) : null,
      estimatedHours: data.estimatedHours ? Number(data.estimatedHours) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      notes: data.notes || null,
      pfhRate: data.pfhRate ? Number(data.pfhRate) : null,
      royaltyShareType: data.royaltyShareType || null,
      contractDate: data.contractDate ? new Date(data.contractDate) : null,
      expectedPayment: data.expectedPayment ? Number(data.expectedPayment) : null,
      paymentDueDate: data.paymentDueDate ? new Date(data.paymentDueDate) : null,
      rightsReversionDate: data.rightsReversionDate ? new Date(data.rightsReversionDate) : null,
      royaltyNotes: data.royaltyNotes || null,
    },
  });

  revalidatePath(`/app/projects/${projectId}`);
  revalidatePath("/app/projects");
  return project;
}

export async function deleteProject(projectId: string) {
  const user = await requireUser();
  await db.project.deleteMany({ where: { id: projectId, userId: user.id } });
  revalidatePath("/app/projects");
}

export async function archiveProject(projectId: string) {
  const user = await requireUser();
  await db.project.updateMany({ where: { id: projectId, userId: user.id }, data: { status: "ARCHIVED" } });
  revalidatePath("/app/projects");
  revalidatePath(`/app/projects/${projectId}`);
}

export async function getProjectsForUser(statusFilter?: string) {
  const user = await requireUser();
  return db.project.findMany({
    where: {
      userId: user.id,
      ...(statusFilter && statusFilter !== "ALL" ? { status: statusFilter as "AUDITIONING" | "CONTRACTED" | "RECORDING" | "PROOFING" | "PICKUPS" | "DELIVERED" | "PAID" | "ARCHIVED" } : {}),
    },
    include: { _count: { select: { pickups: { where: { status: "OPEN" } }, invoices: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProjectById(projectId: string) {
  const user = await requireUser();
  return db.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: {
      pronunciations: { orderBy: { createdAt: "asc" } },
      characters: { orderBy: { createdAt: "asc" } },
      pickups: { orderBy: { createdAt: "asc" } },
      invoices: { orderBy: { createdAt: "asc" } },
    },
  });
}
