import React from "react";
import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/text";
import { ShieldCheck } from "lucide-react";
import { formatDate, formattedOfferStatus } from "@/src/lib/formatters";

interface OfferRespondedStateProps {
  offer: any; 
}

export function OfferRespondedState({ offer }: OfferRespondedStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4">
      <Card className="w-full flex flex-col items-center text-center p-10 md:p-14 bg-white border-gray-200">
        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6">
          <ShieldCheck size={32} strokeWidth={1.5} color="green" />
        </div>
        
        <Text size="4" className="font-bold text-gray-900 mb-2">
          Offer {formattedOfferStatus(offer.status)}
        </Text>
        
        <Text size="2" className="text-gray-500">
          This document has been processed and is no longer pending review. 
          <br className="hidden md:block" />
          Response recorded on <span className="font-semibold text-gray-700">{formatDate(offer.respondedAt)}</span>.
        </Text>
      </Card>
    </div>
  );
}