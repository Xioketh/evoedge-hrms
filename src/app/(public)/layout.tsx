import { PublicHeader } from "@/src/components/layout/PublicHeader";
import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <PublicHeader />

      <main className="flex-1 md:p-2">{children}</main>
    </div>
  ); 
}
