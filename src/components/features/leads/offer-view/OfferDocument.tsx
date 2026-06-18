import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { formatDate, formatEmploymentType } from "@/src/lib/formatters";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { getPublicOfferDownloadUrlAction } from "@/src/actions/offer.actions";
import { toast } from "sonner";

export function OfferDocument({ offer }: { offer: any }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await getPublicOfferDownloadUrlAction(offer.token);
      if (response.success && response.url) {
        const a = document.createElement("a");
        a.href = response.url;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        toast.error(response.message || "Failed to download document");
      }
    } catch (error) {
      toast.error("An error occurred while downloading");
    } finally {
      setIsDownloading(false);
    }
  };

  console.log("offer", offer);
  const offerDetails = [
    {
      label: "Position Title",
      value: offer.jobPosition,
    },
    {
      label: "Reporting Manager",
      value: `${offer.manager.firstName} ${offer.manager.lastName} (Manager, ${offer.department.name})`,
    },
    {
      label: "Employment Type",
      value: `${formatEmploymentType(offer.employmentType)}, Permanent`,
    },
    {
      label: "Start Date",
      value: formatDate(offer.targetStartDate),
    },
  ];

  return (
    <Card className="w-full bg-white md:p-7 border-gray-200">
      <div className="flex justify-end w-full">
        <Button type="button" variant="muted" size="sm" onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isDownloading ? "Downloading..." : "Download PDF"}
        </Button>
      </div>
      <div className="space-y-8">
        <Text size="2" className="text-gray-600">
          Date: {formatDate(offer.createdAt)}
        </Text>

        <Text size="3" className="font-bold text-gray-900">
          Dear {offer.firstName} {offer.lastName},
        </Text>

        {/* Wrapped in a flex container to push it to the right */}

        <Text size="2" className="text-gray-700 leading-relaxed">
          Following our recent discussions and interview process, we are
          delighted to offer you the position of {offer.jobPosition} at{" "}
          {offer.company.name}. We were impressed with your technical expertise
          and creative vision, and we believe you will be a valuable addition to
          our organization. {offer.offerContent}
        </Text>

        {/* 2. Loop through the array in your UI */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
            {offerDetails.map((detail, index) => (
              <div key={index}>
                <Text
                  size="1"
                  className="text-gray-500 font-bold text-[11px] tracking-widest uppercase mb-1"
                >
                  {detail.label}
                </Text>
                <Text size="2" className="font-semibold text-gray-900">
                  {detail.value}
                </Text>
              </div>
            ))}
          </div>
        </div>

        <Text size="2" className="text-gray-700 italic mt-8">
          We are looking forward to having you join our team and contributing to
          the continued success of {offer.company.name}.
        </Text>

        <div className="pt-9">
          <Text size="2" className="font-bold text-gray-900">
            {offer.manager.firstName} {offer.manager.lastName}
          </Text>
          <Text size="1" className="text-gray-500">
            Manager, {offer.department.name}
          </Text>
          <Text size="1" className="text-gray-500">
            {offer.company.name}
          </Text>
        </div>
      </div>
    </Card>
  );
}
