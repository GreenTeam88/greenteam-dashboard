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
// import { ChevronDown, MoreHorizontal } from 'lucide-react';
import * as React from 'react';
// import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';

// import { CustomToolTip } from '@/components/custom/CustomToolTip';
// import { ColumnResizer } from '@/components/custom/TableColumnResizer';
// import ProjectInfoSidebar from '@/components/projects/ProjectInfoSidebar';
// import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CustomDataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  header?: React.ReactNode;
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
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                onSelect={(e) => e.preventDefault()}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
                key={column.id}
                className="py-2 px-3 flex items-center gap-x-2"
              >
                <Checkbox checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(value)} />
                {column.columnDef.header}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function CustomDataTable<T>({ columns, data, header = null }: CustomDataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  // const [colSizing, setColSizing] = useState<ColumnSizingState>({});
  const table = useReactTable({
    data,
    columns,
    // enableColumnResizing: true,
    // columnResizeMode: 'onChange',
    // onColumnSizingChange: setColSizing,
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
      // columnSizing: colSizing,
    },
  });
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/*<Input*/}
        {/*  placeholder="Filter names..."*/}
        {/*  value={(table.getColumn('Name')?.getFilterValue() as string) ?? ''}*/}
        {/*  onChange={(event) => table.getColumn('Name')?.setFilterValue(event.target.value)}*/}
        {/*  className="max-w-sm"*/}
        {/*/>*/}
      </div>
      <div className="rounded-md border bg-white">
        {header}
        <Table className={'bg-white'}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.id === 'actions') {
                    return (
                      <TableHead className={'relative'} key={header.id}>
                        <ToggleColumnVisibilityDropdown table={table} />
                      </TableHead>
                    );
                  }
                  return (
                    <TableHead className={'relative'} key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/*<div className="flex items-center justify-end space-x-2 py-4">*/}
      {/*  <div className="flex-1 text-sm text-muted-foreground">*/}
      {/*    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)*/}
      {/*    selected.*/}
      {/*  </div>*/}
      {/*  <div className="space-x-2">*/}
      {/*    <Button*/}
      {/*      variant="outline"*/}
      {/*      size="sm"*/}
      {/*      onClick={() => table.previousPage()}*/}
      {/*      disabled={!table.getCanPreviousPage()}*/}
      {/*    >*/}
      {/*      Previous*/}
      {/*    </Button>*/}
      {/*    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>*/}
      {/*      Next*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
