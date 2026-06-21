import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { PlusCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/app/ProjectStatusBadge";
import { format } from "date-fns";

const STATUSES = ["ALL", "AUDITIONING", "CONTRACTED", "RECORDING", "PROOFING", "PICKUPS", "DELIVERED", "PAID", "ARCHIVED"];

type ProjectStatus =
  | "AUDITIONING"
  | "CONTRACTED"
  | "RECORDING"
  | "PROOFING"
  | "PICKUPS"
  | "DELIVERED"
  | "PAID"
  | "ARCHIVED";

type ProjectListItem = {
  id: string;
  title: string;
  author: string | null;
  clientPublisher: string | null;
  platform: string;
  status: ProjectStatus;
  dueDate: Date | null;
  _count: {
    pickups: number;
    invoices: number;
    pronunciations: number;
  };
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const statusFilter = params.status ?? "ALL";

  const projects = (await db.project.findMany({
    where: {
      userId: user.id,
      ...(statusFilter !== "ALL" ? { status: statusFilter as "AUDITIONING" | "CONTRACTED" | "RECORDING" | "PROOFING" | "PICKUPS" | "DELIVERED" | "PAID" | "ARCHIVED" } : {}),
    },
    include: { _count: { select: { pickups: { where: { status: "OPEN" } }, invoices: true, pronunciations: true } } },
    orderBy: { updatedAt: "desc" },
  })) as ProjectListItem[];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/app/projects/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-1" /> New Project
          </Button>
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex gap-1.5 flex-wrap">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/app/projects?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === s
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="py-16 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-medium text-gray-700 mb-2">No projects found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {statusFilter !== "ALL" ? `No projects with status "${statusFilter}"` : "Create your first project to get started."}
          </p>
          <Link href="/app/projects/new">
            <Button><PlusCircle className="h-4 w-4 mr-1" /> New Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((project: ProjectListItem) => (
            <Link key={project.id} href={`/app/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="py-4 px-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <ProjectStatusBadge status={project.status} />
                        <h2 className="font-semibold text-gray-900">{project.title}</h2>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        {project.author && <span>by {project.author}</span>}
                        {project.clientPublisher && <span>{project.clientPublisher}</span>}
                        <span>{project.platform}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                      {project._count.pickups > 0 && (
                        <span className="text-red-600 font-medium">{project._count.pickups} open pickups</span>
                      )}
                      <span>{project._count.pronunciations} terms</span>
                      <span>{project._count.invoices} invoices</span>
                      {project.dueDate && (
                        <span>Due {format(new Date(project.dueDate), "MMM d, yyyy")}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
