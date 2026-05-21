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

export const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["HR_DIRECTOR", "manager", "employee"],
  },
  {
    name: "Employee",
    href: "/",
    icon: Users,
    roles: ["HR_DIRECTOR", "manager"],
  },
  {
    name: "Payroll",
    href: "/payroll",
    icon: Banknote,
    roles: ["HR_DIRECTOR", "finance"],
  },
  { name: "Lead", href: "/", icon: Briefcase, roles: ["HR_DIRECTOR", "sales"] },
  {
    name: "Leaves",
    href: "/leaves",
    icon: CalendarDays,
    roles: ["HR_DIRECTOR", "manager", "employee"],
  },
  {
    name: "Resignation",
    href: "/",
    icon: LogOut,
    roles: ["HR_DIRECTOR", "employee"],
  },
  { name: "Settings", href: "/", icon: Settings, roles: ["HR_DIRECTOR"] },
];

export const BOTTOM_NAV_ITEMS = [
  {
    name: "Help & Support",
    href: "/",
    icon: HelpCircle,
    roles: ["HR_DIRECTOR", "manager", "employee", "finance", "sales"],
  },
];