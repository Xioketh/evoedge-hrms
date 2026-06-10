import { EmployeeListItem } from "@/src/types/employee.types";
import { EmployeeRepository } from "../repositories/employee.repository";

export async function getPaginatedEmployees(params: {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
}) {
  const { companyId, page, limit, search } = params;
  const skip = (page - 1) * limit;

  const { users, total } = await EmployeeRepository.findPaginatedWithCount({
    companyId,
    skip,
    take: limit,
    search,
  });

  const data: EmployeeListItem[] = users.map((user) => ({
    id: user.id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    firstName: user.profile?.firstName ?? "N/A",
    lastName: user.profile?.lastName ?? "",
    employeeCode: user.profile?.employeeCode ?? "N/A",
    jobTitle: user.profile?.jobTitle ?? "Unassigned",
    departmentName: user.profile?.department?.name ?? "Unassigned",
    employmentType: user.profile?.employmentType ?? "FULL_TIME",
  }));

  return {
    data,
    metadata: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getEmployeeProfileByUserId(userId: string, companyId: string) {
  const user = await EmployeeRepository.findProfileByUserId(userId, companyId);

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    firstName: user.profile?.firstName ?? "N/A",
    lastName: user.profile?.lastName ?? "",
    employeeCode: user.profile?.employeeCode ?? "N/A",
    jobTitle: user.profile?.jobTitle ?? "Unassigned",
    departmentName: user.profile?.department?.name ?? "Unassigned",
    employmentType: user.profile?.employmentType ?? "FULL_TIME",
    joinedDate: user.profile?.createdAt ?? user.createdAt,
    managerName: user.profile?.manager 
      ? `${user.profile.manager.firstName} ${user.profile.manager.lastName}`
      : "No Reporter",
  };
}