"use client";

import { usePathname } from "next/navigation";
import { getHeaderForPath } from "@/src/config/routes";
import { Text } from "@/src/components/ui/text";
import Link from "next/link";
import { Button } from "../ui/button";

export function PageHeader() {
  const pathname = usePathname();
  const headerInfo = getHeaderForPath(pathname);

  if (!headerInfo) return null;

  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="mb-6 flex flex-col gap-1">
        <Text size={"3"}>{headerInfo.title}</Text>
        <Text size={"2"} color={"muted"}>
          {headerInfo.description}
        </Text>
      </div>
      {headerInfo.action && (
        <Link href={headerInfo.action.href}>
          <Button size={"sm"}>{headerInfo.action.label}</Button>
        </Link>
      )}
    </div>
  );
}
