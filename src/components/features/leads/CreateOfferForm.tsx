"use client";

import * as React from "react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { createOfferAction } from "@/src/actions/offer.actions";
import { CreateOfferFormProps } from "@/src/types/offer.types";
import { INITIAL_OFFER_STATE } from "@/src/constants/offer.constants";

import { Button } from "@/src/components/ui/button";

import PersonalInfoSection from "./create-offer/PersonalInfoSection";
import CompensationSection from "./create-offer/CompensationSection";
import EmploymentDetailsSection from "./create-offer/EmploymentDetailsSection";
import OfferContentSection from "./create-offer/OfferContentSection";

export default function CreateOfferForm({ departments, managers }: CreateOfferFormProps) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(createOfferAction, INITIAL_OFFER_STATE);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Offer created successfully");
      router.push("/lead");
    } else if (state.message) {
      toast.error(state.message);
      router.push("/lead");
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-6">
      {/* TOP ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PersonalInfoSection state={state} />
        </div>
        <div className="space-y-6 flex flex-col">
          <CompensationSection state={state} />
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <EmploymentDetailsSection 
        state={state} 
        departments={departments} 
        managers={managers} 
      />

      {/* BOTTOM SECTION */}
      <OfferContentSection state={state} />

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[180px]"
        >
          {isPending ? "Processing..." : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Offer Letter
            </>
          )}
        </Button>
      </div>
    </form>
  );
}