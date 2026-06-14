"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../icons/logo";
import { Role } from "@prisma/client";
import {
  BOTTOM_NAV_ITEMS,
  NAVIGATION_ITEMS,
} from "@/src/constants/sidebar.constants";

// 👇 1. Add userId to the props
export function Sidebar({ userRole, userId }: { userRole: Role; userId: string }) {
  const pathname = usePathname();
  
  const authorizedNavItems = NAVIGATION_ITEMS.filter((item) =>
    item.roles.includes(userRole),
  );
  
  const authorizedBottomItems = BOTTOM_NAV_ITEMS.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <aside className="w-60 h-screen bg-sidebar text-white flex flex-col p-4">
      <div className="mb-8">
        <Logo className="h-20 w-40" />
      </div>
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto p-1">
        {authorizedNavItems.map((item) => {
          const Icon = item.icon;
          
          let targetHref = item.href;
          if (item.name === "Employee" && userRole === "EMPLOYEE") {
            targetHref = `/employee/${userId}`;
          }

          const isActive =
            pathname === targetHref || pathname.startsWith(`${targetHref}/`);
            
          return (
            <Link
              key={item.name}
              href={targetHref} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-sidebar-primary text-white font-medium"
                  : "text-text-1 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-white" : "opacity-70"}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="mt-auto pt-4 border-t border-white/10">
        {authorizedBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-sidebar-primary text-white font-medium"
                  : "text-text-1 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={15} className="opacity-70" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}