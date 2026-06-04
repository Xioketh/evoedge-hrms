import { getSession } from "@/src/core/services/auth.service";
import { redirect } from "next/navigation";
import { LeaveRequestsGrid } from "@/src/components/features/leaves/LeaveRequestsGrid";

export const metadata = {
  title: "Employee Management | EvoEdge HRMS",
};

export default async function EmployeePage() {
  const session = await getSession();
  
  if (!session) redirect("/login");

 return <></>;
}