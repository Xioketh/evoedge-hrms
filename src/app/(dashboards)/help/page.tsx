import { getSession } from "@/src/core/services/auth.service";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Help & Support | EvoEdge HRMS",
};

export default async function HelpPage() {
  const session = await getSession();
  
  if (!session) redirect("/login");

 return <></>;
}