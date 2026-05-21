// src/components/layout/Header.tsx
import { SessionPayload } from "@/src/types/session.types";
import { Text } from "@/src/components/ui/text";

interface DashboardProps {
  session: SessionPayload;
}

export function Header({ session }: DashboardProps) {
  return (
    <header className="h-15 bg-white border-b flex px-6 justify-end items-center">
      <div className="flex flex-col justify-center">
        <Text>
          {session.firstName} {session.lastName}
        </Text>
        <Text color={"muted"}>
          {session.role}
        </Text>
      </div>
    </header>
  );
}