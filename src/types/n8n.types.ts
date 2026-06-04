export enum N8nWorkflow {
  SEND_JOB_OFFER = "send-job-offer",
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