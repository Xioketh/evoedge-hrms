"use client";

import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { SessionPayload } from "@/src/types/session.types";
import { Text } from "@/src/components/ui/text";
import { ConfirmModal } from "../ui/confirm-modal";

interface DashboardProps {
  session: SessionPayload;
}

export function Header({ session }: DashboardProps) {
  const router = useRouter();

  const handleLogout = async () => {
    router.push("/login");
  };

  return (
    <header className="h-15 bg-white border-b flex px-6 justify-end items-center gap-4">
      <div className="flex flex-col justify-center text-right">
        <Text size={"2"} className="font-bold">
          {session.firstName} {session.lastName}
        </Text>
        <Text color={"muted"}>
          {session.role}
        </Text>
      </div>

      <ConfirmModal
        title="Log Out"
        description="Are you sure you want to log out of EvoHR?"
        onConfirm={handleLogout}
        confirmText="Log Out"
        cancelText="Cancel"
        variant="destructive"
      >
        <button 
          className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
          aria-label="User profile and logout"
        >
          <User className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
        </button>
      </ConfirmModal>
    </header>
  );
}