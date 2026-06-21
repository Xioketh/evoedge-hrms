import { EmployeeListItem } from "@/src/types/employee.types";
import { EmployeeRepository } from "../repositories/employee.repository";
import { uploadToS3, getPresignedUrl } from "./s3.service";

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
    hasCv: !!user.profile?.cvS3Key,
    cvOriginalName: user.profile?.cvOriginalName ?? null,
  };
}

export async function updateEmployee(
  userId: string,
  companyId: string,
  data: { email?: string; employeeCode?: string }
) {
  try {
    const updatedUser = await EmployeeRepository.updateEmployeeDetails(
      userId,
      companyId,
      data
    );
    return { success: true, data: updatedUser };
  } catch (error: any) {
    if (error.code === 'P2002') {
      const target = error.meta?.target as string[] | string;
      if (target?.includes('email')) {
        return { success: false, error: 'Email is already in use.' };
      }
      if (target?.includes('employeeCode')) {
        return { success: false, error: 'Employee ID is already in use.' };
      }
      return { success: false, error: 'A unique constraint failed.' };
    }
    console.error('[UPDATE_EMPLOYEE_ERROR]', error);
    return { success: false, error: 'Failed to update employee details.' };
  }
}

const CV_MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const CV_ALLOWED_TYPES = ["application/pdf"];

export async function uploadEmployeeCv(
  userId: string,
  companyId: string,
  file: File,
) {
  if (!CV_ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only PDF files are accepted.");
  }
  if (file.size > CV_MAX_SIZE) {
    throw new Error("File size exceeds the 5 MB limit.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const datePath = new Date().toISOString().slice(0, 7); // e.g. "2026-06"
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const s3Key = `employees/${userId}/cv/${datePath}/${safeName}`;

  await uploadToS3(buffer, s3Key, file.type);
  await EmployeeRepository.updateCv(userId, companyId, {
    cvS3Key: s3Key,
    cvOriginalName: file.name,
  });
}

export async function getEmployeeCvDownloadUrl(
  userId: string,
  companyId: string,
) {
  const cv = await EmployeeRepository.getCvDetails(userId, companyId);
  if (!cv?.cvS3Key) {
    throw new Error("No CV has been uploaded for this employee.");
  }
  return getPresignedUrl(cv.cvS3Key, cv.cvOriginalName ?? "cv.pdf");
}