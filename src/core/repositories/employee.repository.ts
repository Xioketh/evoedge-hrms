import { db, PrismaTx } from "@/src/core/db/db.client";
import { getRolePrefix } from "../utils/employee-code";
import { Prisma, Role } from "@prisma/client";

export const EmployeeRepository = {
  async findManagersByCompanyId(companyId: string, dbClient: PrismaTx = db) {
    return dbClient.employeeProfile.findMany({
      where: { user: { companyId } },
      select: { id: true, firstName: true, lastName: true },
    });
  },

  async getLatestEmployeeCodeForRole(
    db: Prisma.TransactionClient,
    companyId: string,
    role: Role,
    companyPrefix: string,
  ) {
    const rolePrefix = getRolePrefix(role);
    const searchPrefix = `${companyPrefix}_${rolePrefix}_`;

    // Find the profile with the highest employee code matching the prefix
    const latestProfile = await db.employeeProfile.findFirst({
      where: {
        user: { companyId: companyId },
        employeeCode: { startsWith: searchPrefix },
      },
      orderBy: {
        employeeCode: "desc",
      },
      select: { employeeCode: true },
    });

    return latestProfile?.employeeCode || null;
  },

  async findPaginatedWithCount(
    params: { companyId: string; skip: number; take: number; search?: string },
    dbClient: PrismaTx = db,
  ) {
    const { companyId, skip, take, search } = params;

    const whereClause: Prisma.UserWhereInput = {
      companyId,
      role: {
        not: Role.HR_DIRECTOR,
      },
      ...(search && {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { profile: { firstName: { contains: search, mode: "insensitive" } } },
          { profile: { lastName: { contains: search, mode: "insensitive" } } },
          {
            profile: {
              employeeCode: { contains: search, mode: "insensitive" },
            },
          },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      dbClient.user.findMany({
        where: whereClause,
        skip,
        take,
        include: {
          profile: {
            include: {
              department: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      dbClient.user.count({ where: whereClause }),
    ]);

    return { users, total };
  },

  async findProfileByUserId(
    userId: string,
    companyId: string,
    dbClient: PrismaTx = db,
  ) {
    return dbClient.user.findFirst({
      where: {
        id: userId,
        companyId,
      },
      include: {
        profile: {
          include: {
            department: true,
            manager: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  },
};
