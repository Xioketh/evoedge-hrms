import { ActionState } from "@/src/types/action.types";
import { JobOffer } from "@prisma/client";

export interface Department {
  id: string;
  name: string;
}

export interface Manager {
  id: string;
  firstName: string;
  lastName: string;
}

export interface CreateOfferFormProps {
  departments: Department[];
  managers: Manager[];
}

export interface OfferFormSectionProps {
  state: ActionState;
}

export interface GetOffersParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface DashboardStats {
  total: number;
  accepted: number;
  pending: number;
  declined: number;
}


export type SafeJobOffer = Omit<JobOffer, "baseSalary"> & {
  baseSalary: number;
};