import { z } from "zod";
import { EmploymentType } from "@prisma/client";

export const CreateOfferSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  nicNumber: z.string().min(5, "NIC is required"),
  
  jobPosition: z.string().min(1, "Job position is required"),
  departmentId: z.string().min(1, "Department is required"),
  employmentType: z.nativeEnum(EmploymentType),
  managerId: z.string().min(1, "Reporting manager is required"),
  
  baseSalary: z.coerce.number().positive("Salary must be a positive number"),
  targetStartDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Valid start date is required",
  }),
  
  offerContent: z.string().min(10, "Offer details are required"),
});