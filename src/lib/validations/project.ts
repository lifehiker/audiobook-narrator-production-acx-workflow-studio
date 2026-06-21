import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().optional(),
  clientPublisher: z.string().optional(),
  platform: z.enum(["ACX", "FINDAWAY", "DIRECT", "PUBLISHER", "OTHER"]).default("ACX"),
  contractType: z.enum(["PFH", "ROYALTY_SHARE", "ROYALTY_SHARE_PLUS", "FLAT_FEE", "OTHER"]).default("PFH"),
  status: z.enum(["AUDITIONING", "CONTRACTED", "RECORDING", "PROOFING", "PICKUPS", "DELIVERED", "PAID", "ARCHIVED"]).default("AUDITIONING"),
  wordCount: z.coerce.number().int().positive().optional().or(z.literal("")),
  estimatedHours: z.coerce.number().positive().optional().or(z.literal("")),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  pfhRate: z.coerce.number().positive().optional().or(z.literal("")),
  royaltyShareType: z.string().optional(),
  contractDate: z.string().optional(),
  expectedPayment: z.coerce.number().positive().optional().or(z.literal("")),
  paymentDueDate: z.string().optional(),
  rightsReversionDate: z.string().optional(),
  royaltyNotes: z.string().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
