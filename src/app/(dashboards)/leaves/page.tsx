import { getSession } from "@/src/core/services/auth.service";
import { redirect } from "next/navigation";
import { LeaveRequestsGrid } from "@/src/components/features/leaves/LeaveRequestsGrid";

export const metadata = {
  title: "Leave Management | EvoEdge HRMS",
};

export default async function LeavesPage() {
  const session = await getSession();
  
  if (!session) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
        <p className="text-slate-500">Track, manage, and request time off.</p>
      </div>

      {/* Inject the smart feature component */}
      <LeaveRequestsGrid userRole={session.role} />
    </div>
  );
}