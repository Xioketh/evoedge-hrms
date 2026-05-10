// src/app/(dashboard)/dashboard/page.tsx
import { EmployeeDashboard } from "@/src/components/features/dashboards/EmployeeDashboard";
import { HodDashboard } from "@/src/components/features/dashboards/HodDashboard";
import { HrDirectorDashboard } from "@/src/components/features/dashboards/HrDirectorDashboard";
import { getSession } from "@/src/core/services/auth.service";
import { redirect } from "next/navigation";

export default async function UnifiedDashboardPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  switch (session.role) {
    case "HR_DIRECTOR":
      return <HrDirectorDashboard user={session} />;
    case "EMPLOYEE":
      return <EmployeeDashboard user={session} />;
    case "HOD":
      return <HodDashboard user={session} />;

    default:
      return (
        <div className="p-6">
          <h1 className="text-2xl text-red-600">Access Denied</h1>
          <p>Your role is not recognized. Please contact support.</p>
        </div>
      );
  }
}
