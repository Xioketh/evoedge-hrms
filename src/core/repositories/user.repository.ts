import { db, PrismaTx } from '@/src/core/db/db.client';
import { Role } from '@prisma/client';

export const UserRepository = {
  async findByEmail(email: string, dbClient: PrismaTx = db) {
    return dbClient.user.findUnique({
      where: { email },
      select: { 
        id: true, 
        password: true, 
        role: true, 
        companyId: true, 
        profile: { select: { firstName: true, lastName: true } } 
      }
    });
  },

  async createTenantAdmin(data: any, dbClient: PrismaTx = db) {
    return dbClient.user.create({
      data: {
        email: data.email,
        password: data.hashedPassword,
        role: Role.HR_DIRECTOR,
        companyId: data.companyId,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      },
      include: { profile: true, company: true },
    });
  }
};