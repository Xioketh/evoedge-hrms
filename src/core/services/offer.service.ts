import { OfferStatus } from "@prisma/client";
import { z } from "zod";
import { CreateOfferSchema } from "@/src/types/schemas/offer.schema";
import { JobOfferRepository } from "../repositories/jobOffer.repository";
import { triggerWorkflow } from "./n8n.client";
import {
  N8nWorkflow,
  OfferRespondedPayload,
  SendOfferPayload,
} from "@/src/types/n8n.types";
import { DepartmentRepository } from "../repositories/department.repository";
import { EmployeeRepository } from "../repositories/employee.repository";
import { CompanyRepository } from "../repositories/company.repository";
import { formatDate, formattedOfferStatus } from "@/src/lib/formatters";
import { getSession } from "./auth.service";
import { createEmployeeAccount, generateSecurePassword } from "./user.service";
import { db } from "@/src/core/db/db.client";
import { UserRepository } from "../repositories/user.repository";
import { renderToBuffer } from "@react-pdf/renderer";
import { uploadToS3, getPresignedUrl } from "./s3.service";
import { OfferLetterTemplate } from "../pdf/OfferLetterTemplate";

type CreateOfferDTO = z.infer<typeof CreateOfferSchema>;

export async function getOfferFormOptions(companyId: string) {
  const [departments, managers] = await Promise.all([
    DepartmentRepository.findByCompanyId(companyId),
    EmployeeRepository.findManagersByCompanyId(companyId),
  ]);

  return { departments, managers };
}

export async function createJobOffer(
  data: CreateOfferDTO,
  companyId: string,
  creatorId: string,
) {
  const newOffer = await JobOfferRepository.create(data, companyId, creatorId);
  const company = await CompanyRepository.getCompanyById(companyId);

  const companyName = company?.name || "Our Company";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const portalLink = `${appUrl}/offer/${newOffer.token}`;

  try {

    const pdfBuffer = await renderToBuffer(
      OfferLetterTemplate({ offer: newOffer, companyName })
    );

    const datePath = new Date().toISOString().slice(0, 7);
    const s3Key = await uploadToS3(pdfBuffer, `offers/${datePath}/offer-${newOffer.id}.pdf`, "application/pdf");
    await JobOfferRepository.updateS3Key(newOffer.id, s3Key);

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

export async function getPublicOfferDetails(token: string) {
  const offer = await JobOfferRepository.findByToken(token);
  if (!offer) return null;
  return offer;
}

export async function processCandidateResponse(
  token: string,
  status: OfferStatus,
) {
  const offer = await JobOfferRepository.findByToken(token);
  if (!offer) {
    throw new Error("Offer not found.");
  }

  if (offer.status !== "SENT") {
    throw new Error("This offer has already been processed.");
  }

  const updatedOffer = await JobOfferRepository.updateStatusByToken(
    token,
    status,
  );

  const emailsToNotify = new Set<string>();

  if (offer.createdBy?.email) {
    emailsToNotify.add(offer.createdBy.email);
  }

  if (offer.manager?.user?.email) {
    emailsToNotify.add(offer.manager.user.email);
  }
  try {
    const payload: OfferRespondedPayload = {
      offerId: offer.id,
      candidateName: offer.firstName,
      jobTitle: offer.jobPosition,
      companyId: offer.companyId,
      status: formattedOfferStatus(status),
      respondedAt:
        formatDate(updatedOffer.respondedAt) || formatDate(new Date()),
      notifyEmails: Array.from(emailsToNotify),
    };

    await triggerWorkflow(N8nWorkflow.OFFER_RESPONDED, payload);
  } catch (error) {
    console.error(
      "n8n notification failed, but offer status was updated.",
      error,
    );
  }

  return updatedOffer;
}

export async function getPaginatedOffers(searchParams: {
  [key: string]: string | undefined;
}) {
  const session = await getSession();
  if (!session?.companyId) throw new Error("Unauthorized");

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  const search = searchParams?.search || "";
  const status = searchParams?.status || "ALL";

  const { data, total } = await JobOfferRepository.getOffersWithCount(
    session.companyId,
    page,
    limit,
    search,
    status,
  );

  const serializedOffers = data.map((offer) => ({
    ...offer,
    baseSalary: Number(offer.baseSalary),
  }));

  return {
    data: serializedOffers,
    metadata: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getDashboardStats() {
  const session = await getSession();
  if (!session?.companyId) throw new Error("Unauthorized");

  const rawStats = await JobOfferRepository.getOfferStats(session.companyId);
  const stats = {
    total: 0,
    accepted: 0,
    pending: 0,
    declined: 0,
  };

  rawStats.forEach((group) => {
    stats.total += group._count.id;
    if (group.status === "CANDIDATE_ACCEPTED" || group.status === "COMPLETED")
      stats.accepted += group._count.id;
    if (group.status === "SENT" || group.status === "QUEUED")
      stats.pending += group._count.id;
    if (group.status === "CANDIDATE_DECLINED")
      stats.declined += group._count.id;
  });

  return stats;
}

export async function processOfferAcceptance(offerId: string) {
  const session = await getSession();
  if (!session?.companyId || !session?.userId) throw new Error("Unauthorized");
  const companyId = session.companyId;
  const adminUserId = session.userId;

  const offer = await JobOfferRepository.getOfferById(offerId, companyId);
  if (!offer) throw new Error("Job offer not found or unauthorized.");
  if (offer.status !== "CANDIDATE_ACCEPTED") {
    throw new Error(
      "Cannot create user: Offer is not in CANDIDATE_ACCEPTED state.",
    );
  }

  const existingUser = await UserRepository.findByEmail(offer.email);
  if (existingUser) {
    throw new Error(`Cannot create account: A user with the email ${offer.email} already exists.`);
  }
  const company = await CompanyRepository.getCompanyById(companyId);
  if (!company) throw new Error("Company not found.");

  const { tempPassword, hashedPassword } = await generateSecurePassword();

  const result = await db.$transaction(async (tx) => {
    const user = await createEmployeeAccount(tx, {
      email: offer.email,
      hashedPassword: hashedPassword,
      companyId: offer.companyId,
      companyName: company.name,
      firstName: offer.firstName,
      lastName: offer.lastName,
      departmentId: offer.departmentId,
      managerId: offer.managerId,
      employmentType: offer.employmentType,
      jobTitle: offer.jobPosition,
      baseSalary: offer.baseSalary
    });

    const updatedOffer = await JobOfferRepository.completeOfferWithTx(
      tx,
      offerId,
      adminUserId,
    );

    return { user, updatedOffer };
  });

  return result;
}

async function generateUrlForOffer(offer: { s3ObjectKey: string | null; firstName: string; lastName: string } | null) {
  if (!offer || !offer.s3ObjectKey) {
    throw new Error("Offer document not found.");
  }
  
  const filename = `Offer_Letter_${offer.firstName}_${offer.lastName}.pdf`.replace(/\s+/g, "_");
  return await getPresignedUrl(offer.s3ObjectKey, filename);
}

export async function getPublicOfferDownloadUrl(token: string) {
  const offer = await JobOfferRepository.findByToken(token);
  return await generateUrlForOffer(offer);
}

export async function getSecureOfferDownloadUrl(offerId: string, companyId: string) {
  const offer = await JobOfferRepository.getOfferById(offerId, companyId);
  return await generateUrlForOffer(offer);
}
