import { ActionState } from "@/src/types/action.types";

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