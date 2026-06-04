import { db, PrismaTx } from '@/src/core/db/db.client';

export const EmployeeRepository = {
  async findManagersByCompanyId(companyId: string, dbClient: PrismaTx = db) {
    return dbClient.employeeProfile.findMany({
      where: { user: { companyId } },
      select: { id: true, firstName: true, lastName: true },
    });
  },
};