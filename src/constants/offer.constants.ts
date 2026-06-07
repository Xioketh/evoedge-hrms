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

export const statusConfig: Record<string, string> = {
  QUEUED: "bg-blue-50 text-blue-700 border-blue-200",
  DRAFT: "bg-slate-50 text-slate-700 border-slate-200",
  SEND_FAILED: "bg-red-50 text-red-700 border-red-200",
  SENT: "bg-indigo-50 text-indigo-700 border-indigo-200",
  CANDIDATE_ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANDIDATE_DECLINED: "bg-rose-50 text-rose-700 border-rose-200",
  EXPIRED: "bg-orange-50 text-orange-700 border-orange-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-gray-50 text-gray-700 border-gray-200",
};
