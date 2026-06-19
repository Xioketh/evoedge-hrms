"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/src/core/services/auth.service";
import { updateEmployee } from "@/src/core/services/employee.service";
import { Role } from "@prisma/client";

export async function updateEmployeeAction(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; error?: string; message?: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (session.role === Role.EMPLOYEE) {
    return { success: false, error: "Insufficient permissions" };
  }

  const userId = formData.get("userId") as string;
  const email = formData.get("email") as string;
  const employeeCode = formData.get("employeeCode") as string;

  if (!userId) {
    return { success: false, error: "User ID is required" };
  }

  // Update employee
  const result = await updateEmployee(userId, session.companyId, {
    email: email || undefined,
    employeeCode: employeeCode || undefined,
  });

  if (!result.success) {
    return result;
  }

  // Revalidate the employee page to reflect changes
  revalidatePath(`/employee/${userId}`);

  return { success: true, message: "Employee details updated successfully" };
}
