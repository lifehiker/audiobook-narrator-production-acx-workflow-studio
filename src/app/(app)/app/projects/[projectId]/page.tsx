import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectStatusBadge } from "@/components/app/ProjectStatusBadge";
import { PronunciationsTab } from "@/components/app/tabs/PronunciationsTab";
import { CharactersTab } from "@/components/app/tabs/CharactersTab";
import { PickupsTab } from "@/components/app/tabs/PickupsTab";
import { BusinessTab } from "@/components/app/tabs/BusinessTab";
import { InvoicesTab } from "@/components/app/tabs/InvoicesTab";
import { archiveProject, deleteProject } from "@/actions/projects";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireUser();
  const { projectId } = await params;

  const project = await db.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: {
      pronunciations: { orderBy: { createdAt: "asc" } },
      characters: { orderBy: { createdAt: "asc" } },
      pickups: { orderBy: { createdAt: "asc" } },
      invoices: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!project) notFound();

  async function handleArchive() {
    "use server";
    await archiveProject(projectId);
    redirect("/app/projects");
  }

  async function handleDelete() {
    "use server";
    await deleteProject(projectId);
    redirect("/app/projects");
  }

  const openPickups = project.pickups.filter((p: { status: string }) => p.status === "OPEN").length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <Link href="/app/projects">
            <Button variant="ghost" size="sm" className="mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <ProjectStatusBadge status={project.status} />
              <h1 className="text-2xl font-bold">{project.title}</h1>
            </div>
            <div className="flex gap-3 text-sm text-gray-500">
              {project.author && <span>by {project.author}</span>}
              {project.clientPublisher && <span>· {project.clientPublisher}</span>}
              {project.platform && <span>· {project.platform}</span>}
              {project.dueDate && <span>· Due {format(new Date(project.dueDate), "MMM d, yyyy")}</span>}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <form action={handleArchive}>
            <Button type="submit" variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-1" /> Archive
            </Button>
          </form>
          <form action={handleDelete}>
            <Button type="submit" variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </form>
        </div>
      </div>

      {project.notes && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          {project.notes}
        </div>
      )}

      <Tabs defaultValue="pronunciations">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="pronunciations">
            Pronunciations ({project.pronunciations.length})
          </TabsTrigger>
          <TabsTrigger value="characters">
            Characters ({project.characters.length})
          </TabsTrigger>
          <TabsTrigger value="pickups">
            Pickups {openPickups > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{openPickups}</span>}
          </TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="invoices">
            Invoices ({project.invoices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pronunciations">
          <PronunciationsTab projectId={project.id} initialEntries={project.pronunciations} />
        </TabsContent>

        <TabsContent value="characters">
          <CharactersTab projectId={project.id} initialCharacters={project.characters} />
        </TabsContent>

        <TabsContent value="pickups">
          <PickupsTab projectId={project.id} initialPickups={project.pickups} />
        </TabsContent>

        <TabsContent value="business">
          <BusinessTab project={project} />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoicesTab projectId={project.id} initialInvoices={project.invoices} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
