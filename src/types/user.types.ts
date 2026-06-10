import { EmploymentType, Prisma, Role } from "@prisma/client";

export type CreateEmployeeWithProfileInput = {
  email: string;
  hashedPassword: string;
  role: Role;
  companyId: string;

  firstName: string;
  lastName: string;
  employeeCode: string;

  departmentId?: string | null;
  managerId?: string | null;
  jobTitle?: string | null;
  employmentType?: EmploymentType | null;
  baseSalary?: Prisma.Decimal | null;
  joinedAt?: Date | null;
};