import { Badge } from "@/components/ui/badge";

type Plan = "FREE_TRIAL" | "SOLO" | "PRO" | "STUDIO";

const PLAN_CONFIG: Record<Plan, { label: string; className: string }> = {
  FREE_TRIAL: { label: "Free Trial", className: "bg-gray-100 text-gray-700 border-gray-200" },
  SOLO: { label: "Solo", className: "bg-blue-100 text-blue-800 border-blue-200" },
  PRO: { label: "Pro", className: "bg-purple-100 text-purple-800 border-purple-200" },
  STUDIO: { label: "Studio", className: "bg-amber-100 text-amber-800 border-amber-200" },
};

export function PlanBadge({ plan }: { plan: Plan | null }) {
  const config = PLAN_CONFIG[plan ?? "FREE_TRIAL"];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
