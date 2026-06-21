"use server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  projectId: z.string(),
  invoiceNumber: z.string().optional(),
  amountCents: z.coerce.number().int().default(0),
  sentDate: z.string().optional(),
  dueDate: z.string().optional(),
  paidDate: z.string().optional(),
  status: z.enum(["DRAFT", "SENT", "OVERDUE", "PAID"]).default("DRAFT"),
});

async function assertProjectOwnership(projectId: string, userId: string) {
  const project = await db.project.findFirst({ where: { id: projectId, userId } });
  if (!project) throw new Error("Project not found");
}

export async function createInvoice(input: unknown) {
  const user = await requireUser();
  const data = schema.parse(input);
  await assertProjectOwnership(data.projectId, user.id);
  const invoice = await db.invoice.create({
    data: {
      projectId: data.projectId,
      invoiceNumber: data.invoiceNumber || null,
      amountCents: data.amountCents,
      sentDate: data.sentDate ? new Date(data.sentDate) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      paidDate: data.paidDate ? new Date(data.paidDate) : null,
      status: data.status,
    },
  });
  revalidatePath("/app/invoices");
  revalidatePath(`/app/projects/${data.projectId}`);
  return invoice;
}

export async function updateInvoice(id: string, input: unknown) {
  const user = await requireUser();
  const data = schema.parse(input);
  await assertProjectOwnership(data.projectId, user.id);
  const invoice = await db.invoice.update({
    where: { id },
    data: {
      invoiceNumber: data.invoiceNumber || null,
      amountCents: data.amountCents,
      sentDate: data.sentDate ? new Date(data.sentDate) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      paidDate: data.paidDate ? new Date(data.paidDate) : null,
      status: data.status,
    },
  });
  revalidatePath("/app/invoices");
  revalidatePath(`/app/projects/${data.projectId}`);
  return invoice;
}

export async function deleteInvoice(id: string) {
  const user = await requireUser();
  const inv = await db.invoice.findFirst({
    where: { id },
    include: { project: true },
  });
  if (!inv || inv.project.userId !== user.id) throw new Error("Invoice not found");
  await db.invoice.delete({ where: { id } });
  revalidatePath("/app/invoices");
  revalidatePath(`/app/projects/${inv.projectId}`);
}

export async function getInvoices() {
  const user = await requireUser();
  return db.invoice.findMany({
    where: { project: { userId: user.id } },
    include: { project: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
}
