import { getSession } from "@/src/core/services/auth.service";
import { getEmployeeProfileByUserId } from "@/src/core/services/employee.service";
import { notFound, redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { Mail, User, Calendar, Network, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { EditEmployeeModal } from "./_components/edit-employee-modal";

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

  const metaIndicators = [
    {
      label: "Employee ID",
      icon: User,
      value: employee.employeeCode,
    },
    {
      label: "Joined",
      icon: Calendar,
      value: new Date(employee.joinedDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
    },
    {
      label: "Email Address",
      icon: Mail,
      value: employee.email,
      truncate: true,
    },
    {
      label: "Reporting To",
      icon: Network,
      value: employee.managerName,
    },
  ];

  return (
    <div className="space-y-6 mx-auto">
      {/* Back to Directory button for management */}
      {session.role !== Role.EMPLOYEE && (
        <Link href="/employee" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
          <ArrowLeft className="size-4" /> Back to Directory
        </Link>
      )}

      {/* Profile Header Block */}
      <Card>
        <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-primary/10 border flex items-center justify-center text-primary font-semibold text-xl">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Text size="3">
                  {employee.firstName} {employee.lastName}
                </Text>
                <Text className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider">
                  {employee.employmentType.replace("_", " ")}
                </Text>
              </div>
              <Text color="muted">{employee.jobTitle} • {employee.departmentName}</Text>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {employee.isActive ? "Active Status" : "Inactive"}
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {session.role !== Role.EMPLOYEE && (
              <EditEmployeeModal
                userId={employee.id}
                email={employee.email}
                employeeCode={employee.employeeCode || ""}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Meta Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metaIndicators.map((indicator, index) => (
          <Card key={index} className="bg-dark">
            <CardContent className="pt-6">
              <Text className="tracking-wider uppercase" color="muted">
                {indicator.label}
              </Text>
              <div className={`flex items-center gap-2 mt-1 ${indicator.truncate ? 'truncate' : ''}`}>
                <indicator.icon className="size-4 text-muted-foreground shrink-0" />
                <Text size={'2'} className={indicator.truncate ? 'truncate' : undefined}>{indicator.value}</Text>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}