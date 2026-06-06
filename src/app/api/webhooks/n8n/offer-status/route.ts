import { NextResponse } from "next/server";
import { OfferStatus } from "@prisma/client"; 
import { JobOfferRepository } from "@/src/core/repositories/jobOffer.repository";

export async function POST(request: Request) {
  try {
     const authHeader = request.headers.get("Authorization");
    const expectedToken = process.env.N8N_CALLBACK_SECRET;

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { offerId, success, errorMessage } = body;

    if (!offerId) {
      return NextResponse.json({ error: "Missing offerId" }, { status: 400 });
    }

    // 2. Update status based on the result from n8n
    if (success) {
      await JobOfferRepository.updateStatus(offerId, "SENT" as OfferStatus);
    } else {
      await JobOfferRepository.updateStatus(offerId, "SEND_FAILED" as OfferStatus);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[n8n Callback Webhook Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}