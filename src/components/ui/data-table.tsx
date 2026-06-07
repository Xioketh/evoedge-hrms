"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[]; 
  data: TData[];
  metadata: { total: number; page: number; totalPages: number; limit: number };
  searchPlaceholder?: string;
  currentSearch?: string;
}

export function DataTable<TData>({
  columns,
  data,
  metadata,
  searchPlaceholder = "Search...",
  currentSearch = "",
}: DataTableProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        updateURL("search", searchTerm);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentSearch]);

  const updateURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, String(value));
    else params.delete(key);

    if (key === "search") params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full flex flex-col">
      {/* Generic Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="w-[300px]">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* <div className="flex gap-2">
          <Button variant="default" size="sm">Filters</Button>
          <Button variant="default" size="sm">Export</Button>
        </div> */}
      </div>

      {/* Generic Table Content */}
      <div className={`overflow-x-auto transition-opacity duration-200 ${isPending ? "opacity-50" : "opacity-100"}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4 text-text-1 font-semibold text-dark tracking-wider uppercase">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0 hover:bg-muted/10 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Generic Pagination */}
      {metadata.total > 0 && (
        <div className="flex items-center justify-between p-4 border-t">
          <Text size="1" color="muted">
            Showing <span className="font-medium">{(metadata.page - 1) * metadata.limit + 1}-
            {Math.min(metadata.page * metadata.limit, metadata.total)}</span> of <span className="font-medium">{metadata.total}</span>
          </Text>
          <div className="flex space-x-2">
            <Button size="sm" disabled={metadata.page <= 1 || isPending} onClick={() => updateURL("page", metadata.page - 1)}>
              &lt;
            </Button>
            <Button size="sm" disabled={metadata.page >= metadata.totalPages || isPending} onClick={() => updateURL("page", metadata.page + 1)}>
              &gt;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}