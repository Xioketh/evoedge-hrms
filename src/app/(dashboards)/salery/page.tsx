import { getSession } from "@/src/core/services/auth.service";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Salery Management | EvoEdge HRMS",
};

export default async function SaleryPage() {
  const session = await getSession();
  
  if (!session) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Salery Management</h1>
        <p className="text-slate-500">Track, manage, and request time off.</p>
      </div>
    </div>
  );
}