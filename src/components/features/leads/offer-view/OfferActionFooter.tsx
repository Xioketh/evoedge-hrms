import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { ShieldCheck } from "lucide-react";
import { OfferStatus } from "@prisma/client";

interface OfferActionFooterProps {
  isSubmitting: boolean;
  onRespond: (status: OfferStatus) => void;
}

export function OfferActionFooter({ isSubmitting, onRespond }: OfferActionFooterProps) {
  return (
    <Card className="w-full bg-white flex flex-col md:flex-row justify-between items-center p-4 md:px-6 md:py-4 gap-4 border-gray-200">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
          <ShieldCheck size={24} strokeWidth={1.5} />
        </div>
        <div>
          <Text size="2" className="font-bold text-gray-900">
            Offer Status: Pending Review
          </Text>
          <Text size="1" className="text-gray-500">
            Please review the document and provide your response.
          </Text>
        </div>
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        <Button
          variant="destructive"
          disabled={isSubmitting}
          onClick={() => onRespond(OfferStatus.CANDIDATE_DECLINED)}
        >
          Decline Offer
        </Button>
        <Button
          variant="default"
          disabled={isSubmitting}
          onClick={() => onRespond(OfferStatus.CANDIDATE_ACCEPTED)}
        >
          Accept Offer
        </Button>
      </div>
    </Card>
  );
}