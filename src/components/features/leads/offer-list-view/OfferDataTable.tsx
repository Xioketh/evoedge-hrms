"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { formatDate } from "@/src/lib/formatters";
import { Eye, Download, UserCheck } from "lucide-react";
import { Text } from "@/src/components/ui/text";
import { DataTable } from "@/src/components/ui/data-table";
import { Card } from "@/src/components/ui/card";
import { SafeJobOffer } from "@/src/types/offer.types";
import { OfferStatusBadge } from "./OfferStatusBadge";
import { ConfirmModal } from "@/src/components/ui/confirm-modal";
import { toast } from "sonner";
import { convertOfferToUserAction } from "@/src/actions/offer.actions";

interface OfferDataTableProps {
  data: SafeJobOffer[];
  metadata: { total: number; page: number; totalPages: number; limit: number };
  currentSearch: string;
}

const columnHelper = createColumnHelper<SafeJobOffer>();

const handleCreateUser = async (offerId: string) => {
  const response = await convertOfferToUserAction(offerId);
  if (response.success) {
    toast.success(response.message);
  } else {
    toast.error(response.message);
  }
};

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
        <Eye className="size-5 cursor-pointer hover:text-foreground" />
        <Download className="size-5 cursor-pointer hover:text-primary" />
        {row.original.status === "CANDIDATE_ACCEPTED" && (
          <ConfirmModal
            title="Create User Account"
            description={`Are you sure you want to create an account for ${row.original.firstName} ${row.original.lastName}? This will finalize the onboarding process and mark the offer as completed.`}
            confirmText="Create Account"
            onConfirm={() => handleCreateUser(row.original.id)}
          >
            <UserCheck className="size-5 cursor-pointer text-emerald-600 hover:text-emerald-700 transition-colors" />
          </ConfirmModal>
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
