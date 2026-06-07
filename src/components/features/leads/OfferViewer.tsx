"use client"

import { useState } from "react";
import { OfferStatus } from "@prisma/client";
import { respondToOfferAction } from "@/src/actions/offer.actions";
import { toast } from "sonner";
import { OfferDocument } from "./offer-view/OfferDocument";
import { OfferActionFooter } from "./offer-view/OfferActionFooter";
import { OfferRespondedState } from "./offer-view/OfferRespondedState";

export default function OfferViewer({ offer }: { offer: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = async (status: OfferStatus) => {
    setIsSubmitting(true);
    
    const result = await respondToOfferAction(offer.token, status);
      
    if (!result.success) {
      toast.error(result.message);
      setIsSubmitting(false);
      return;
    }
      
    toast.success(result.message);
    setIsSubmitting(false);
  };

 if (offer.status !== OfferStatus.SENT) {
    return <OfferRespondedState offer={offer} />;
  }

  return (
    <div className="flex flex-col items-center gap-6 pb-12 w-full max-w-4xl mx-auto">
      <OfferActionFooter isSubmitting={isSubmitting} onRespond={handleResponse} />
      <OfferDocument offer={offer} />
    </div>
  );
}