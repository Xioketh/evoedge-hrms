import { db, PrismaTx } from '@/src/core/db/db.client';

export const DepartmentRepository = {
  async findByCompanyId(companyId: string, dbClient: PrismaTx = db) {
    return dbClient.department.findMany({
      where: { companyId },
      select: { id: true, name: true },
    });
  },
};