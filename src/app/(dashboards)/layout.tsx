import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { Header } from "@/src/components/layout/Header";
import { PageHeader } from "@/src/components/layout/PageHeader";
import { getSession } from "@/src/core/services/auth.service";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="fixed inset-0 flex bg-background">
      <Sidebar userRole={session.role} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header session={session} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <PageHeader />
          {children}
        </main>
      </div>
    </div>
  );
}
