import { EmploymentType, Prisma, Role } from "@prisma/client";
import { UserRepository } from "../repositories/user.repository";
import { EmployeeRepository } from "../repositories/employee.repository";
import { generateEmployeeCodeString } from "../utils/employee-code";
import bcrypt from "bcryptjs";
import { Decimal } from "@prisma/client/runtime/client";

export async function generateSecurePassword() {
  const tempPassword = Math.random().toString(36).slice(-10) + "A1@";
  const hashedPassword = await bcrypt.hash(tempPassword, 10);
  return { tempPassword, hashedPassword };
}

export async function createEmployeeAccount(
  tx: Prisma.TransactionClient,
  data: {
    email: string;
    hashedPassword: string;
    companyId: string;
    companyName: string;
    firstName: string;
    lastName: string;
    departmentId?: string | null;
    managerId?: string | null;
    jobTitle?: string | null;
    employmentType?: EmploymentType | null;
    baseSalary?: Decimal | null;
    role?: Role;
  },
) {
  const role = data.role ?? Role.EMPLOYEE;
  const companyPrefix = data.companyName.substring(0, 3).toUpperCase();

  const latestCode = await EmployeeRepository.getLatestEmployeeCodeForRole(
    tx,
    data.companyId,
    role,
    companyPrefix,
  );

  const employeeCode = generateEmployeeCodeString(
    data.companyName,
    role,
    latestCode,
  );
  return UserRepository.createEmployeeWithProfile(tx, {
    email: data.email,
    hashedPassword: data.hashedPassword,
    role: role,
    companyId: data.companyId,
    firstName: data.firstName,
    lastName: data.lastName,
    departmentId: data.departmentId,
    managerId: data.managerId,
    employeeCode: employeeCode,
    jobTitle: data.jobTitle,
    employmentType: data.employmentType,
    baseSalary: data.baseSalary,
  });
}
