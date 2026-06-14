"use server";

import { z } from "zod";
import { getSession } from "@/src/core/services/auth.service";
import { createJobOffer, processCandidateResponse, processOfferAcceptance } from "@/src/core/services/offer.service";
import { CreateOfferSchema } from "../types/schemas/offer.schema";
import { ActionState } from "../types/action.types";
import { OfferStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { formattedOfferStatus } from "../lib/formatters";

export async function createOfferAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const rawData = Object.fromEntries(formData.entries());

  try {
    const validatedData = CreateOfferSchema.parse(rawData);
    await createJobOffer(validatedData, session.companyId, session.userId);

    return { success: true, message: "Offer created and sent to candidate!" };

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        fieldErrors: error.flatten().fieldErrors,
        inputs: rawData,
      };
    }
    
    return {
      success: false,
      message: error.message || "An unexpected error occurred while creating the offer.",
      inputs: rawData,
    };
  }
}


export async function respondToOfferAction(
  token: string, 
  status: OfferStatus
): Promise<ActionState> {
  try {
    await processCandidateResponse(token, status);
    revalidatePath(`/offer/${token}`);
    
    return { 
      success: true, 
      message: `Offer ${formattedOfferStatus(status)} successfully.` 
    };

  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to process your response. Please try again.",
    };
  }
}

export async function convertOfferToUserAction(offerId: string) {
  try {
    const session = await getSession();
    if (!session || !session.companyId) {
      throw new Error("Unauthorized");
    }

    await processOfferAcceptance(offerId);
    revalidatePath("/leads"); 
    
    return { success: true, message: "User account and Employee profile created successfully." };
  } catch (error) {
    console.error("Action error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to create user account." 
    };
  }
}