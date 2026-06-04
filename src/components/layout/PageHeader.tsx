"use client";

import { usePathname } from "next/navigation";
import { getHeaderForPath } from "@/src/config/routes";
import { Text } from "@/src/components/ui/text";

export function PageHeader() {
  const pathname = usePathname();
  const headerInfo = getHeaderForPath(pathname);

  if (!headerInfo) return null;

  return (
    <div className="mb-6 flex flex-col gap-1">
      <Text size={"3"}>{headerInfo.title}</Text>
      <Text size={"2"} color={"muted"}>{headerInfo.description}</Text>
    </div>
  );
}