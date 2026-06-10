"use client";

import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye, Edit } from "lucide-react";
import { Text } from "@/src/components/ui/text";
import { DataTable } from "@/src/components/ui/data-table";
import { Card } from "@/src/components/ui/card";
import { EmployeeListItem } from "@/src/types/employee.types";
import { useRouter } from "next/navigation";

interface EmployeeDataTableProps {
  data: EmployeeListItem[];
  metadata: { total: number; page: number; totalPages: number; limit: number };
  currentSearch: string;
}

const columnHelper = createColumnHelper<EmployeeListItem>();

export function EmployeeDataTable({
  data,
  metadata,
  currentSearch,
}: EmployeeDataTableProps) {
  const router = useRouter();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        id: "employeeName",
        header: "EMPLOYEE",
        cell: (info) => (
          <div className="flex flex-col">
            <Text size="2" className="font-medium">
              {info.getValue()}
            </Text>
            <Text size="1" color="muted">
              {info.row.original.email}
            </Text>
          </div>
        ),
      }),
      columnHelper.accessor("employeeCode", {
        header: "CODE",
        cell: (info) => (
          <Text size="1" className="font-mono text-muted-foreground">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor("jobTitle", {
        header: "TITLE & DEPT",
        cell: (info) => (
          <div className="flex flex-col">
            <Text size="1" className="font-medium">
              {info.getValue()}
            </Text>
            <Text size="1" color="muted">
              {info.row.original.departmentName}
            </Text>
          </div>
        ),
      }),
      columnHelper.accessor("role", {
        header: "SYSTEM ROLE",
        cell: (info) => (
          <Text size="1" color="muted" className="capitalize">
            {info.getValue().replace("_", " ").toLowerCase()}
          </Text>
        ),
      }),
      columnHelper.accessor("isActive", {
        header: "STATUS",
        cell: (info) => {
          const isActive = info.getValue();
          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "ACTIONS",
        cell: ({ row }) => (
          <div className="flex gap-3 text-muted-foreground">
            <Eye
              className="size-5 cursor-pointer hover:text-foreground transition-colors"
              onClick={() => router.push(`/employee/${row.original.id}`)}
            />
          </div>
        ),
      }),
    ],
    [router] // Add router to the dependency array
  );

  return (
    <Card>
      <DataTable
        columns={columns}
        data={data}
        metadata={metadata}
        currentSearch={currentSearch}
        searchPlaceholder="Search by name, email, or code..."
      />
    </Card>
  );
}