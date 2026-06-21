"use server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { canCreateProject } from "@/lib/limits";

export async function createSampleProject() {
  const user = await requireUser();

  const activeCount = await db.project.count({ where: { userId: user.id, status: { not: "ARCHIVED" } } });
  if (!canCreateProject(user.subscription?.plan ?? null, activeCount)) {
    throw new Error("Project limit reached. Please upgrade your plan.");
  }

  const project = await db.project.create({
    data: {
      userId: user.id,
      title: "The Dragon's Awakening (Sample)",
      author: "Jane Austen",
      clientPublisher: "ACX Publisher",
      platform: "ACX",
      contractType: "PFH",
      status: "RECORDING",
      wordCount: 85000,
      estimatedHours: 9.5,
      dueDate: new Date(Date.now() + 30 * 86400000),
      notes: "This is a sample project to help you explore the app.",
      pfhRate: 225,
      contractDate: new Date(Date.now() - 10 * 86400000),
      expectedPayment: 213750,
      paymentDueDate: new Date(Date.now() + 45 * 86400000),
      rightsReversionDate: new Date(Date.now() + 365 * 86400000 * 7),
      royaltyNotes: "PFH $225/hr. Rights revert after 7 years.",
      pronunciations: {
        createMany: {
          data: [
            { term: "Aelindra", phonetic: "AY-lin-dra", category: "Character", source: "Author note", status: "CONFIRMED" },
            { term: "Veltharion", phonetic: "vel-THAR-ee-on", category: "Character", source: "Author email", status: "CONFIRMED" },
            { term: "Quelithas", phonetic: "kweh-LI-thas", category: "Place", source: "Pronunciation guide p.3", status: "NEEDS_RESEARCH" },
            { term: "Drakneth", phonetic: "DRAK-neth", category: "Character", source: "Book glossary", status: "RECORDED" },
            { term: "Ithraelen", phonetic: "ith-RAY-eh-len", category: "Place", source: "Guessed from context", status: "NEEDS_RESEARCH" },
          ],
        },
      },
      characters: {
        createMany: {
          data: [
            { name: "Aelindra", voiceNotes: "Young, curious, determined. Light, clear voice.", accentNotes: "Neutral American", firstAppearance: "Chapter 1, page 1" },
            { name: "Veltharion", voiceNotes: "Ancient dragon lord. Deep, resonant, authoritative.", accentNotes: "Slight Welsh lilt", firstAppearance: "Chapter 3, page 47" },
            { name: "Mira Sandoval", voiceNotes: "Aelindra's mentor. Warm, weathered.", accentNotes: "Neutral American, slight Southern warmth", firstAppearance: "Chapter 1, page 8" },
          ],
        },
      },
      pickups: {
        createMany: {
          data: [
            { chapter: "3", location: "00:12:34", issueType: "PRONUNCIATION", originalText: "Veltharion rose from the depths", correctedText: "Re-record: vel-THAR-ee-on", status: "OPEN" },
            { chapter: "5", location: "00:28:15", issueType: "NOISE", originalText: "background HVAC noise", notes: "Re-record whole paragraph", status: "RECORDED" },
            { chapter: "7", location: "00:45:02", issueType: "MISREAD", originalText: "She ran quickly", correctedText: "She ran swiftly", status: "OPEN" },
          ],
        },
      },
      invoices: {
        createMany: {
          data: [
            { invoiceNumber: "INV-001", amountCents: 213750, sentDate: new Date(Date.now() - 5 * 86400000), dueDate: new Date(Date.now() + 25 * 86400000), status: "SENT" },
          ],
        },
      },
    },
  });

  revalidatePath("/app/projects");
  revalidatePath("/app");
  return project;
}
