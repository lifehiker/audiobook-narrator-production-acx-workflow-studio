import { Badge } from "@/components/ui/badge";

type ProjectStatus =
  | "AUDITIONING"
  | "CONTRACTED"
  | "RECORDING"
  | "PROOFING"
  | "PICKUPS"
  | "DELIVERED"
  | "PAID"
  | "ARCHIVED";

const STATUS_CONFIG: Record<ProjectStatus, { label: string; className: string }> = {
  AUDITIONING: { label: "Auditioning", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  CONTRACTED: { label: "Contracted", className: "bg-blue-100 text-blue-800 border-blue-200" },
  RECORDING: { label: "Recording", className: "bg-purple-100 text-purple-800 border-purple-200" },
  PROOFING: { label: "Proofing", className: "bg-orange-100 text-orange-800 border-orange-200" },
  PICKUPS: { label: "Pickups", className: "bg-pink-100 text-pink-800 border-pink-200" },
  DELIVERED: { label: "Delivered", className: "bg-teal-100 text-teal-800 border-teal-200" },
  PAID: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
  ARCHIVED: { label: "Archived", className: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.ARCHIVED;
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
