import { Role } from "@prisma/client";
import {
  LayoutDashboard,
  Users,
  Banknote,
  Briefcase,
  LogOut,
  CalendarDays,
  Settings,
  HelpCircle,
} from "lucide-react";

export const HR_ADMINS: Role[] = ["HR_DIRECTOR", "HR_MANAGER"];
export const ALL_HR_STAFF: Role[] = ["HR_DIRECTOR", "HR_MANAGER", "HR_EXECUTIVE"];
export const EVERYONE: Role[] = ["HR_DIRECTOR", "HR_MANAGER", "HR_EXECUTIVE", "TREASURY", "HOD", "EMPLOYEE"];

export const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: EVERYONE, // Scaling friendly
  },
  {
    name: "Employee",
    href: "/employee",
    icon: Users,
    roles: EVERYONE, // Handled dynamically in the page controller
  },
  {
    name: "Payroll",
    href: "/payroll",
    icon: Banknote,
    roles: ["HR_DIRECTOR", "TREASURY"] as Role[], // Only specific personnel
  },
  { 
    name: "Lead", 
    href: "/lead", 
    icon: Briefcase, 
    roles: ALL_HR_STAFF 
  },
  {
    name: "Leaves",
    href: "/leaves",
    icon: CalendarDays,
    roles: EVERYONE,
  },
  {
    name: "Resignation",
    href: "/resignation",
    icon: LogOut,
    roles: ALL_HR_STAFF,
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings, 
    roles: ["HR_DIRECTOR"] as Role[] 
  },
];

export const BOTTOM_NAV_ITEMS = [
  {
    name: "Help & Support",
    href: "/help",
    icon: HelpCircle,
    roles: EVERYONE,
  },
];