"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { formatDate } from "@/src/lib/formatters";
import { Eye, Download, Mail } from "lucide-react";
import { Text } from "@/src/components/ui/text";
import { DataTable } from "@/src/components/ui/data-table";
import { Card } from "@/src/components/ui/card";
import { SafeJobOffer } from "@/src/types/offer.types";
import { OfferStatusBadge } from "./OfferStatusBadge"; // Import the new component

interface OfferDataTableProps {
  data: SafeJobOffer[];
  metadata: { total: number; page: number; totalPages: number; limit: number };
  currentSearch: string;
}

const columnHelper = createColumnHelper<SafeJobOffer>();

const columns = [
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: "employeeName",
    header: "EMPLOYEE NAME",
    cell: (info) => (
      <Text size="2" className="font-medium">
        {info.getValue()}
      </Text>
    ),
  }),
  columnHelper.accessor("nicNumber", {
    header: "NIC NUMBER",
    cell: (info) => (
      <Text size="1" color="muted">
        {info.getValue()}
      </Text>
    ),
  }),
  columnHelper.accessor("jobPosition", {
    header: "POSITION",
    cell: (info) => (
      <Text size="1" color="muted">
        {info.getValue()}
      </Text>
    ),
  }),
  columnHelper.accessor("baseSalary", {
    header: "SALARY",
    cell: (info) => (
      <Text size="1" color="muted">
        {Number(info.getValue()).toLocaleString()}
      </Text>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "SENT DATE",
    cell: (info) => (
      <Text size="1" color="muted">
        {formatDate(info.getValue())}
      </Text>
    ),
  }),
  // Updated Status Column
  columnHelper.accessor("status", {
    header: "STATUS",
    cell: (info) => <OfferStatusBadge status={info.getValue()} />,
  }),
  columnHelper.display({
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => (
      <div className="flex gap-3 text-muted-foreground">
        <Eye className="size-4 cursor-pointer hover:text-foreground" />
        {row.original.status === "SENT" ? (
          <Mail className="size-4 cursor-pointer hover:text-primary" />
        ) : (
          <Download className="size-4 cursor-pointer hover:text-primary" />
        )}
      </div>
    ),
  }),
];

export function OfferDataTable({
  data,
  metadata,
  currentSearch,
}: OfferDataTableProps) {
  return (
    <Card>
      <DataTable
        columns={columns}
        data={data}
        metadata={metadata}
        currentSearch={currentSearch}
        searchPlaceholder="Search by Name or NIC..."
      />
    </Card>
  );
}