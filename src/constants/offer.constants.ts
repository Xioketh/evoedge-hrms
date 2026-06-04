import { ActionState } from "@/src/types/action.types";

export const INITIAL_OFFER_STATE: ActionState = { 
  success: false 
};

export const EMPLOYMENT_TYPES = [
  { label: "Full Time", value: "FULL_TIME" },
  { label: "Part Time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Internship", value: "INTERNSHIP" },
] as const;