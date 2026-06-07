import { getSession } from "@/src/core/services/auth.service";
import {
  getPaginatedOffers,
  getDashboardStats,
} from "@/src/core/services/offer.service";
import { redirect } from "next/navigation";
import { OfferDataTable } from "@/src/components/features/leads/offer-list-view/OfferDataTable";
import { DashboardStatsCards } from "@/src/components/features/leads/offer-list-view/DashboardStatsCards";

export const metadata = {
  title: "Offer Letter Management | EvoEdge HRMS",
};

export default async function LeadPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const resolvedParams = await searchParams;

  const [stats, { data: offers, metadata }] = await Promise.all([
    getDashboardStats(),
    getPaginatedOffers(resolvedParams),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <DashboardStatsCards stats={stats} />
      <OfferDataTable
        data={offers}
        metadata={metadata}
        currentSearch={resolvedParams.search || ""}
      />
    </div>
  );
}
