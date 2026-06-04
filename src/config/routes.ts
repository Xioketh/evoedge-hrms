export type PageHeaderData = {
  title: string;
  description: string;
};

export const PAGE_HEADERS: Record<string, PageHeaderData> = {
  "/dashboard": {
    title: "Command Center",
    description: "Overview of your organizational pulse today.",
  },
  "/payroll": {
    title: "Monthly Salary Management",
    description: "Review and manage employee payroll records for the current period.",
  },
  "/employee": {
    title: "Employee Directory",
    description: "Manage and view all personnel records across the organization.",
  },
  "/leaves": {
    title: "Leave Management",
    description: "Track and approve employee time-off requests.",
  },
   "/lead": {
    title: "Lead Management",
    description: "Manage and track sales leads.",
  }, 
  "/lead/create": {
    title: "Offer Letter Generation",
    description: "",
  },
  "/resignation": {
    title: "Resignation Management",
    description: "Manage and review employee resignation requests.",
  },
  "/settings": {
    title: "Settings Management",
    description: "Configure and manage system settings.",
  },
  "/help": {
    title: "Help & Support",
    description: "Get assistance and support for using the HRMS.",
  }
};

export function getHeaderForPath(pathname: string): PageHeaderData | null {
  if (PAGE_HEADERS[pathname]) {
    return PAGE_HEADERS[pathname];
  }
  
  return null;
}