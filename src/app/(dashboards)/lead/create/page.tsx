import CreateOfferForm from "@/src/components/features/leads/CreateOfferForm";
import { getSession } from "@/src/core/services/auth.service";
import { getOfferFormOptions } from "@/src/core/services/offer.service";
import { redirect } from "next/navigation";

export default async function CreateOfferPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { departments, managers } = await getOfferFormOptions(session.companyId);

  return (
    <div className="max-w-8xl">
      <CreateOfferForm departments={departments} managers={managers} />
    </div>
  );
}