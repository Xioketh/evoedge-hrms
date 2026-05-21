// src/types/action.types.ts

export type ActionState<T = any> = {
  success: boolean;
  message?: string; // Global error or success message
  fieldErrors?: Record<string, string[]>; // For Zod validation errors
  data?: T; // Optional payload for successful actions
  inputs?: Record<string, unknown>; // Submitted form data
};