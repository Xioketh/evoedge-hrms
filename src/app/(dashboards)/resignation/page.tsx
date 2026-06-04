import { getSession } from "@/src/core/services/auth.service";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Resignation Management | EvoEdge HRMS",
};

export default async function ResignationPage() {
  const session = await getSession();
  
  if (!session) redirect("/login");

 return <></>;
}