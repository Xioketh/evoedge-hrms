// src/actions/auth.actions.ts
"use server";
import {
  createSession,
  verifyCredentials,
  registerTenant,
} from "@/src/core/services/auth.service";
import { z } from "zod";
import { ActionState } from "../types/action.types";
import { LoginSchema, SignupSchema } from "../types/schemas/auth.schema";

export async function loginAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const validatedData = LoginSchema.parse(rawData);

    const TEST_EMAIL = "sarah.director@evoedge.com"; // Replace with your actual DB test email
    const TEST_PASSWORD = "Owner@123";   // Replace with your actual DB test password

    // const validUser = await verifyCredentials(
    //   TEST_EMAIL,
    //   TEST_PASSWORD
    // );

    const validUser = await verifyCredentials(
      validatedData.email,
      validatedData.password,
    );

    if (!validUser) {
      return {
        success: false,
        message: "Invalid email or password",
        inputs: rawData,
      };
    }

    await createSession({
      userId: validUser.id,
      role: validUser.role,
      companyId: validUser.companyId,
      firstName: validUser.firstName,
      lastName: validUser.lastName,
    });
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
      message: error.message || "An unexpected error occurred",
      inputs: rawData,
    };
  }

  return { success: true };
}

export async function signupAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const validatedData = SignupSchema.parse(rawData);
    const newUser = await registerTenant(validatedData);

    return {
      success: true,
      data: { userId: newUser.id },
      message: "Account created successfully",
    };
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
      message: error.message || "Failed to create account",
      inputs: rawData,
    };
  }
}
