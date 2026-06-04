import { db, PrismaTx } from '@/src/core/db/db.client';

export const CompanyRepository = {
  async createCompanyWithDepartments(
    companyName: string, 
    departments: string[], 
    dbClient: PrismaTx = db
  ) {
    return dbClient.company.create({
      data: {
        name: companyName,
        departments: {
          create: departments.map((name) => ({ name })),
        },
      },
    });
  },

  async getCompanyById(id: string, dbClient: PrismaTx = db) {
    return dbClient.company.findUnique({
      where: { id },
    });
  }
};