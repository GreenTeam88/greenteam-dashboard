'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';
import { FiEdit } from 'react-icons/fi';

import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CustomDataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  header?: React.ReactNode;
  onRowClick?: (item: T) => void; // Function to execute when a row is clicked
}

function ToggleColumnVisibilityDropdown({ table }: { table: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={'flex items-center justify-center'}>
          <FiEdit size={16} className={'cursor-pointer'} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={'bg-white rounded-lg'} align="end">
        <div className={'py-2 px-3 border-b border-b-black20 text-sm text-textBlackNew font-semibold'}>Edit column</div>
        {table
          .getAllColumns()
          // @ts-expect-error do not have table type
          .filter((column) => column.getCanHide())
          // @ts-expect-error do not have table type
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              onSelect={(e) => e.preventDefault()}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(value)}
              className="py-2 px-3 flex items-center gap-x-2"
            >
              <Checkbox checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(value)} />
              {column.columnDef.header}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function CustomDataTable<T>({ columns, data, header = null, onRowClick }: CustomDataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {header}
      <Table className="bg-white">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                if (header.id === 'actions') {
                  return (
                    <TableHead className="relative" key={header.id}>
                      <ToggleColumnVisibilityDropdown table={table} />
                    </TableHead>
                  );
                }
                return (
                  <TableHead className="relative" key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => onRowClick && onRowClick(row.original)}
              className="cursor-pointer hover:bg-bgLightGreen" // Tailwind CSS for hover effect
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
