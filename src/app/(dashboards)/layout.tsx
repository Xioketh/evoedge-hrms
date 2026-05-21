// src/app/(dashboards)/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { Header } from "@/src/components/layout/Header";
import { getSession } from "@/src/core/services/auth.service";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen">
      <Sidebar userRole={session.role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header session={session} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
