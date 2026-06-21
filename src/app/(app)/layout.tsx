import { requireUser } from "@/lib/auth";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader user={{ name: user.name, email: user.email }} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 pt-4 md:pt-6 mt-14 md:mt-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
