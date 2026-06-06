import { OfferStatus } from "@prisma/client";
import { z } from "zod";
import { CreateOfferSchema } from "@/src/types/schemas/offer.schema";
import { JobOfferRepository } from "../repositories/jobOffer.repository";
import { triggerWorkflow } from "./n8n.client";
import { N8nWorkflow, SendOfferPayload } from "@/src/types/n8n.types";
import { DepartmentRepository } from "../repositories/department.repository";
import { EmployeeRepository } from "../repositories/employee.repository";
import { CompanyRepository } from "../repositories/company.repository";

type CreateOfferDTO = z.infer<typeof CreateOfferSchema>;

export async function getOfferFormOptions(companyId: string) {
  const [departments, managers] = await Promise.all([
    DepartmentRepository.findByCompanyId(companyId),
    EmployeeRepository.findManagersByCompanyId(companyId),
  ]);

  return { departments, managers };
}

export async function createJobOffer(data: CreateOfferDTO, companyId: string) {
  const newOffer = await JobOfferRepository.create(data, companyId);
  const company = await CompanyRepository.getCompanyById(companyId);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const portalLink = `${appUrl}/portal/offer/${newOffer.token}`;

  try {
    console.log("Triggering n8n workflow to send offer email with payload:");
    await triggerWorkflow<SendOfferPayload>(N8nWorkflow.SEND_JOB_OFFER, {
      offerId: newOffer.id,
      candidateEmail: newOffer.email,
      candidateName: newOffer.firstName,
      jobTitle: newOffer.jobPosition,
      companyName: company?.name || "Our Company",
      offerLink: portalLink,
      offerContent: newOffer.offerContent,
    });
    return {
      offer: newOffer,
      status: "SENT",
      message: "Offer created and emailed to candidate!",
    };
  } catch (webhookError) {
    await JobOfferRepository.updateStatus(
      newOffer.id,
      "SEND_FAILED" as OfferStatus,
    );
    throw new Error(
      "Offer saved, but the email failed to send. Please try resending from the dashboard.",
    );
  }
}
