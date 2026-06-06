import { db } from "@/src/core/db/db.client";
import { z } from "zod";
import { OfferStatus } from "@prisma/client";
import { CreateOfferSchema } from "@/src/types/schemas/offer.schema";

type CreateOfferDTO = z.infer<typeof CreateOfferSchema>;

export const JobOfferRepository = {
  async create(data: CreateOfferDTO, companyId: string) {
    return await db.jobOffer.create({
      data: {
        ...data,
        targetStartDate: new Date(data.targetStartDate),
        companyId,
        status: OfferStatus.QUEUED,
      },
    });
  },

  async updateStatus(id: string, status: OfferStatus) {
    return await db.jobOffer.update({
      where: { id },
      data: { status },
    });
  }
};