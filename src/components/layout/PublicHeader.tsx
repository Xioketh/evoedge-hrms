import React from "react";
import { Logo } from "@/src/components/icons/logo";

export function PublicHeader() {
  return (
    <header className="w-full bg-login-gradient border-b border-gray-200 px-2 py-1 sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between">
        <div className="flex gap-2">
          <Logo className="h-12 w-24" />
        </div>
      </div>
    </header>
  );
}
