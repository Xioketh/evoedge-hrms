import { statusConfig } from "@/src/constants/offer.constants";
import { formattedOfferStatus } from "@/src/lib/formatters";

interface OfferStatusBadgeProps {
  status: string;
}

export function OfferStatusBadge({ status }: OfferStatusBadgeProps) {
  const colorClass = statusConfig[status] || "bg-slate-50 text-slate-700 border-slate-200";
  const formattedText = formattedOfferStatus(status);

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-text-1 ${colorClass}`}
    >
      {formattedText}
    </div>
  );
}