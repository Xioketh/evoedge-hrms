"use server";

import { z } from "zod";
import { getSession } from "@/src/core/services/auth.service";
import { createJobOffer } from "@/src/core/services/offer.service";
import { CreateOfferSchema } from "../types/schemas/offer.schema";
import { ActionState } from "../types/action.types";

export async function createOfferAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized" };

  const rawData = Object.fromEntries(formData.entries());

  try {
    const validatedData = CreateOfferSchema.parse(rawData);
    await createJobOffer(validatedData, session.companyId);

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