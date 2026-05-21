
export interface SessionProps {
  user: SessionPayload;
}

export type SessionPayload = {
  userId: string;
  role: string;
  companyId: string;
  firstName: string;
  lastName: string;
};