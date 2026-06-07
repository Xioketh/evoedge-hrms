import { OfferStatus } from "@prisma/client";

export enum N8nWorkflow {
  SEND_JOB_OFFER = "send-job-offer",
  OFFER_RESPONDED = "offer-responded",
}

// Define the exact payload n8n expects for the job offer email
export interface SendOfferPayload {
  offerId: string;
  candidateEmail: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  offerLink: string;
  offerContent: string;
}


export interface OfferRespondedPayload {
  offerId: string;
  candidateName: string;
  jobTitle: string;
  companyId: string;
  status: string;
  respondedAt: string;
  notifyEmails: string[];
}