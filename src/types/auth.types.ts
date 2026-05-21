import { LucideIcon } from "lucide-react";
import { ActionState } from "./action.types";

export type FormField = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  Icon?: LucideIcon;       
  isPassword?: boolean;
  required?: boolean;
  hint?: string;
  minLength?: number;
  halfWidth?: boolean;
  dividerBefore?: boolean;
};

export const initialState: ActionState = {
  success: false,
  message: "",
  fieldErrors: {},
};