import { Card, CardContent } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { DashboardStats } from "@/src/types/offer.types";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  // Added icon and a specific color class for each stat type
  const statCards = [
    {
      id: "total",
      label: "Total Offer Letters",
      value: stats.total,
      icon: FileText,
      iconColor: "text-blue-500",
    },
    {
      id: "accepted",
      label: "Accepted Offers",
      value: stats.accepted,
      icon: CheckCircle,
      iconColor: "text-emerald-500",
    },
    {
      id: "pending",
      label: "Pending Offers",
      value: stats.pending,
      icon: Clock,
      iconColor: "text-amber-500",
    },
    {
      id: "declined",
      label: "Declined Offers",
      value: stats.declined,
      icon: XCircle,
      iconColor: "text-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Text size="2" color="muted">
                  {stat.label}
                </Text>
                <Icon className={`size-8 ${stat.iconColor}`} />
              </div>
              <Text size="4" className="mt-2 font-bold">
                {stat.value.toLocaleString()}
              </Text>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
