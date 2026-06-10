import { Role } from "@prisma/client";

export function getRolePrefix(role: Role): string {
  switch (role) {
    case "HR_DIRECTOR": return "HRD";
    case "HR_MANAGER": return "HRM";
    case "HR_EXECUTIVE": return "HRE";
    case "TREASURY": return "TRS";
    case "HOD": return "HOD";
    case "EMPLOYEE": 
    default: 
      return "EMP";
  }
}

export function generateEmployeeCodeString(
  companyName: string,
  role: Role,
  latestCode: string | null
): string {
  // 1. Get first 3 letters of company name, uppercase
  const companyPrefix = companyName.substring(0, 3).toUpperCase();
  
  // 2. Get role prefix
  const rolePrefix = getRolePrefix(role);

  // 3. Determine next sequence
  let nextSequence = 1;
  if (latestCode) {
    // Example latestCode: "EVO_EMP_00010"
    const parts = latestCode.split('_');
    const lastPart = parts[parts.length - 1]; // "00010"
    
    if (lastPart && !isNaN(Number(lastPart))) {
      nextSequence = parseInt(lastPart, 10) + 1;
    }
  }

  // 4. Pad with zeros (e.g., length of 5: "00011")
  const sequenceStr = nextSequence.toString().padStart(5, '0');

  // Result: EVO_EMP_00011
  return `${companyPrefix}_${rolePrefix}_${sequenceStr}`;
}