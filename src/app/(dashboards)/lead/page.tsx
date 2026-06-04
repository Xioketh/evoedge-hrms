import { getSession } from "@/src/core/services/auth.service";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Lead Management | EvoEdge HRMS",
};

export default async function LeadPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  return (
    <>
      <Link href="/lead/create">Create Lead</Link>
    </>
  );
}
