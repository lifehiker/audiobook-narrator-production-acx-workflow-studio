import { Plan } from "@prisma/client";

export function getProjectLimit(plan: Plan | null): number | null {
  switch (plan) {
    case "SOLO":
      return 5;
    case "PRO":
    case "STUDIO":
      return null; // unlimited
    case "FREE_TRIAL":
    default:
      return 2;
  }
}

export function canCreateProject(plan: Plan | null, activeCount: number): boolean {
  const limit = getProjectLimit(plan);
  if (limit === null) return true;
  return activeCount < limit;
}
