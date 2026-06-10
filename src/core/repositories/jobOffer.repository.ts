import { db } from "@/src/core/db/db.client";
import { z } from "zod";
import { OfferStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { CreateOfferSchema } from "@/src/types/schemas/offer.schema";

type CreateOfferDTO = z.infer<typeof CreateOfferSchema>;

export const JobOfferRepository = {
  async create(data: CreateOfferDTO, companyId: string, creatorId: string) {
    return await db.jobOffer.create({
      data: {
        ...data,
        targetStartDate: new Date(data.targetStartDate),
        companyId,
        createdById: creatorId,
        status: OfferStatus.QUEUED,
      },
    });
  },

  async updateStatus(id: string, status: OfferStatus) {
    return await db.jobOffer.update({
      where: { id },
      data: { status },
    });
  },

  async findByToken(token: string) {
    return await db.jobOffer.findUnique({
      where: { token },
      include: {
        company: true,
        department: true,
        manager: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  },

  async updateStatusByToken(token: string, status: OfferStatus) {
    return await db.jobOffer.update({
      where: { token },
      data: {
        status,
        respondedAt: new Date(),
      },
    });
  },

  async getOffersWithCount(
    companyId: string,
    page: number,
    limit: number,
    search?: string,
    status?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.JobOfferWhereInput = {
      companyId,
      ...(status && status !== "ALL" ? { status: status as OfferStatus } : {}),
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { nicNumber: { contains: search } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      db.jobOffer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.jobOffer.count({ where }),
    ]);

    return { data, total };
  },

  async getOfferStats(companyId: string) {
    return await db.jobOffer.groupBy({
      by: ["status"],
      where: { companyId },
      _count: { id: true },
    });
  },

  async getOfferById(id: string, companyId: string) {
    return db.jobOffer.findUnique({
      where: { id, companyId }
    });
  },

async completeOfferWithTx(
    db: Prisma.TransactionClient, 
    id: string, 
    adminUserId: string
  ) {
    return db.jobOffer.update({
      where: { id },
      data: { 
        status: "COMPLETED",
        completedById: adminUserId,
        completedAt: new Date(),
      }
    });
  }
};
