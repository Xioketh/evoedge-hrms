import { redirect } from "next/navigation";
import { getSession } from "@/src/core/services/auth.service";
import { Role } from "@prisma/client";

/**
 * Enforces role-based security access rules on Next.js Server Components.
 * Returns the active verified session if authorized.
 */
export async function enforceRoleAccess(allowedRoles: Role[]) {
  const session = await getSession();
  
  // 1. Unauthenticated users get bounced to login
  if (!session) {
    redirect("/login");
  }

  // 2. Authenticated but unauthorized users get safely redirected
  if (!allowedRoles.includes(session.role as Role)) {
    // Redirect them back to their authorized dashboard root
    redirect("/dashboard"); 
  }

  return session;
}