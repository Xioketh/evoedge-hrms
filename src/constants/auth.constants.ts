import { Mail, Lock } from "lucide-react";
import { FormField } from "../types/auth.types";

export const LOGIN_FORM_FIELDS: FormField[] = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
    // placeholder: "kethaka.r@evoedgesolutions.com",
    Icon: Mail,
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    Icon: Lock,
    isPassword: true,
    required: true,
  },
];

export const SIGNUP_FORM_FIELDS: FormField[] = [
  {
    name: "companyName",
    label: "Company Name",
    type: "text",
    required: true,
  },
  {
    name: "departments",
    label: "Departments",
    type: "text",
    placeholder: "HR, IT, Finance, Sales",
    hint: "Example: Engineering, Marketing, Operations",
    required: true,
  },
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    halfWidth: true,
    dividerBefore: true,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
    halfWidth: true,
  },
  {
    name: "email",
    label: "Work Email",
    type: "email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    minLength: 8,
  },
];