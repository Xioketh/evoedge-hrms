import { N8nWorkflow } from "@/src/types/n8n.types";

// Pull these from your .env file
const N8N_BASE_URL = process.env.N8N_WEBHOOK_URL;
const N8N_AUTH_TOKEN = process.env.N8N_AUTH_TOKEN;

export async function triggerWorkflow<T>(workflow: N8nWorkflow, payload: T) {
  if (!N8N_BASE_URL) {
    throw new Error("N8N_WEBHOOK_URL is not configured in environment variables.");
  }

  const endpoint = `${N8N_BASE_URL}/${workflow}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Secure your webhooks so random internet scanners can't trigger your workflows
        "Authorization": `Bearer ${N8N_AUTH_TOKEN}`, 
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n responded with ${response.status}: ${errorText}`);
    }

    // Return the JSON if your n8n workflow ends with a "Respond to Webhook" node
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    
    return { success: true };
  } catch (error) {
    console.error(`[N8n Integration Error] Workflow: ${workflow}`, error);
    throw error;
  }
}