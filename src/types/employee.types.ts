import { EmploymentType, Role } from "@prisma/client";

export interface EmployeeListItem {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  firstName: string;
  lastName: string;
  employeeCode: string | null;
  jobTitle: string | null;
  departmentName: string | null;
  employmentType: EmploymentType;
}