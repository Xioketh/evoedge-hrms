import { db, PrismaTx } from "@/src/core/db/db.client";
import { CreateEmployeeWithProfileInput } from "@/src/types/user.types";
import { Prisma, Role } from "@prisma/client";

export const UserRepository = {
  async findByEmail(email: string, dbClient: PrismaTx = db) {
    return dbClient.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        role: true,
        companyId: true,
        profile: { select: { firstName: true, lastName: true } },
      },
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
  },

  async createEmployeeWithProfile(
    db: Prisma.TransactionClient,
    data: CreateEmployeeWithProfileInput,
  ) {
    return db.user.create({
      data: {
        email: data.email,
        password: data.hashedPassword,
        role: data.role,
        companyId: data.companyId,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            employeeCode: data.employeeCode,
            departmentId: data.departmentId,
            managerId: data.managerId,
            jobTitle: data.jobTitle,
            baseSalary: data.baseSalary,
            ...(data.employmentType != null && {
              employmentType: data.employmentType,
            }),
          },
        },
      },
      include: {
        profile: true,
      },
    });
  },
};
