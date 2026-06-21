import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { PlusCircle, BookOpen, AlertCircle, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/app/ProjectStatusBadge";
import { OnboardingChecklist } from "@/components/app/OnboardingChecklist";
import { createSampleProject } from "@/actions/sampleData";
import { PlanBadge } from "@/components/app/PlanBadge";
import { format } from "date-fns";

type ProjectStatus =
  | "AUDITIONING"
  | "CONTRACTED"
  | "RECORDING"
  | "PROOFING"
  | "PICKUPS"
  | "DELIVERED"
  | "PAID"
  | "ARCHIVED";

type RecentProject = {
  id: string;
  title: string;
  author: string | null;
  status: ProjectStatus;
  dueDate: Date | null;
  _count: {
    pickups: number;
    invoices: number;
  };
};

export default async function DashboardPage() {
  const user = await requireUser();

  const [projects, auditions, invoices, totalProjects, openPickups] = await Promise.all([
    db.project.findMany({
      where: { userId: user.id, status: { not: "ARCHIVED" } },
      include: { _count: { select: { pickups: { where: { status: "OPEN" } }, invoices: true } } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }) as Promise<RecentProject[]>,
    db.audition.count({ where: { userId: user.id } }),
    db.invoice.findMany({
      where: { project: { userId: user.id }, status: "OVERDUE" },
    }),
    db.project.count({ where: { userId: user.id, status: { not: "ARCHIVED" } } }),
    db.pickupNote.count({
      where: {
        status: "OPEN",
        project: { userId: user.id, status: { not: "ARCHIVED" } },
      },
    }),
  ]);

  const checklistSteps = [
    { id: "account", label: "Create your account", description: "You did it!", done: true },
    { id: "project", label: "Create your first project", description: "Go to Projects and click New Project", done: totalProjects > 0 },
    { id: "pronunciation", label: "Add pronunciation entries", description: "Open a project and go to the Pronunciations tab", done: false },
    { id: "audition", label: "Log your first audition", description: "Go to Auditions and track your pipeline", done: auditions > 0 },
    { id: "billing", label: "Upgrade your plan", description: "Get unlimited projects with a paid plan", done: user.subscription?.plan !== "FREE_TRIAL" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name?.split(" ")[0] ?? "Narrator"}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <PlanBadge plan={user.subscription?.plan ?? null} />
            {user.subscription?.trialEndsAt && user.subscription.plan === "FREE_TRIAL" && (
              <span className="text-xs text-gray-500">
                Trial ends {format(new Date(user.subscription.trialEndsAt), "MMM d")}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <form action={async () => { "use server"; await createSampleProject(); }}>
            <Button type="submit" variant="outline" size="sm">Load Sample</Button>
          </form>
          <Link href="/app/projects/new">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-1" /> New Project
            </Button>
          </Link>
        </div>
      </div>

      <OnboardingChecklist steps={checklistSteps} />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-1 pt-4">
            <CardTitle className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" /> Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-gray-900">{totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4">
            <CardTitle className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> Open Pickups
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className={`text-3xl font-bold ${openPickups > 0 ? "text-red-600" : "text-gray-900"}`}>{openPickups}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4">
            <CardTitle className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" /> Overdue Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className={`text-3xl font-bold ${invoices.length > 0 ? "text-red-600" : "text-gray-900"}`}>{invoices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4">
            <CardTitle className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Auditions
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-gray-900">{auditions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          <Link href="/app/projects" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>

        {projects.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-3">
              <BookOpen className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">No projects yet</h3>
            <p className="text-sm text-gray-500 mb-4">Start by creating your first project or loading sample data.</p>
            <Link href="/app/projects/new">
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-1" /> Create Project
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-2">
            {projects.map((project: RecentProject) => (
              <Link key={project.id} href={`/app/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex items-center justify-between py-3 px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <ProjectStatusBadge status={project.status} />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{project.title}</div>
                        {project.author && (
                          <div className="text-xs text-gray-500">by {project.author}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                      {project._count.pickups > 0 && (
                        <span className="text-red-600 font-medium">{project._count.pickups} pickups</span>
                      )}
                      {project.dueDate && (
                        <span>Due {format(new Date(project.dueDate), "MMM d")}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
