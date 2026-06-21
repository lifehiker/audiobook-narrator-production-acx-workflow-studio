"use server";

import { signOut } from "@/auth";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Display name is required").max(120),
});

export async function updateProfile(input: unknown) {
  const user = await requireUser();
  const data = profileSchema.parse(input);

  await db.user.update({
    where: { id: user.id },
    data: { name: data.name },
  });

  revalidatePath("/app/settings");
  revalidatePath("/app");
  return { ok: true };
}

export async function deleteCurrentAccount() {
  const user = await requireUser();

  await db.user.delete({
    where: { id: user.id },
  });

  await signOut({ redirectTo: "/" });
}
