import { getSession } from "@/src/core/services/auth.service";
import { getEmployeeProfileByUserId } from "@/src/core/services/employee.service";
import { notFound, redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EmployeeCvCard } from "@/src/components/features/employees/employee-details/EmployeeCvCard";
import { EmployeeProfileHeader } from "@/src/components/features/employees/employee-details/EmployeeProfileHeader";
import { EmployeeMetaIndicators } from "@/src/components/features/employees/employee-details/EmployeeMetaIndicators";

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id: targetUserId } = await params;

  if (session.role === Role.EMPLOYEE && session.userId !== targetUserId) {
    redirect(`/employee/${session.userId}`);
  }

  const employee = await getEmployeeProfileByUserId(targetUserId, session.companyId);
  if (!employee) notFound();

  return (
    <div className="space-y-6 mx-auto">
      {/* Back to Directory button for management */}
      {session.role !== Role.EMPLOYEE && (
        <Link href="/employee" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
          <ArrowLeft className="size-4" /> Back to Directory
        </Link>
      )}

      {/* Profile Header Block */}
      <EmployeeProfileHeader 
        employee={employee} 
        canEdit={session.role !== Role.EMPLOYEE} 
      />

      {/* Meta Indicators Grid */}
      <EmployeeMetaIndicators employee={employee} />

      {/* CV Upload / Download */}
      <EmployeeCvCard
        userId={employee.id}
        hasCv={employee.hasCv}
        cvOriginalName={employee.cvOriginalName}
      />
    </div>
  );
}