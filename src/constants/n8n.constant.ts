import { N8nWorkflow } from "../types/n8n.types";

export const WORKFLOW_CALLBACK_MAP: Partial<Record<N8nWorkflow, string>> = {
  [N8nWorkflow.SEND_JOB_OFFER]: "/api/webhooks/n8n/offer-status",
};