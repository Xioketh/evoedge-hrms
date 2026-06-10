import { getPaginatedEmployees } from "@/src/core/services/employee.service";
import { EmployeeDataTable } from "@/src/components/features/employees/employee-list-view/EmployeeDataTable";
import { getSession } from "@/src/core/services/auth.service";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

interface EmployeePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmployeePage({
  searchParams,
}: EmployeePageProps) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === Role.EMPLOYEE) {
    redirect(`/employee/${session.userId}`);
  }

  const params = await searchParams;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const search = typeof params.search === "string" ? params.search : "";
  const limit = 10;

  const companyId = session.companyId;

  const { data, metadata } = await getPaginatedEmployees({
    companyId,
    page,
    limit,
    search,
  });

  return (
    <EmployeeDataTable data={data} metadata={metadata} currentSearch={search} />
  );
}
