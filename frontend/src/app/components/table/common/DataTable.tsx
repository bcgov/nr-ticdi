import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table } from './Table';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableCell } from './TableCell';
import { useState } from 'react';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  enableSorting?: boolean;
  initialSorting?: { id: string; desc: boolean }[];
  paginationSetup?: { pageSize: number; enabled: boolean };
}

export function DataTable<TData>({
  columns,
  data,
  paginationSetup = { pageSize: 300, enabled: false },
  enableSorting = false,
  initialSorting = [{ id: 'id', desc: false }],
}: DataTableProps<TData>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: paginationSetup.pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="" style={{ width: 'auto', marginBottom: '10px', marginTop: '10px' }}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const customCss = (header.column.columnDef.meta as any)?.customCss;
                return (
                  <TableHead
                    key={header.id}
                    style={customCss}
                    onClick={() => header.column.getCanSort() && header.column.toggleSorting()}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {/* Optionally, add a sorting indicator */}
                    {header.column.getIsSorted() ? (header.column.getIsSorted() === 'desc' ? ' 🔽' : ' 🔼') : ''}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const customCss = (cell.column.columnDef.meta as any)?.customCss;
                  return (
                    <TableCell key={cell.id} style={customCss}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No Results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* simple pagination controls */}
      {paginationSetup.enabled && (
        <div className="flex items-center gap-2">
          <button
            className="border rounded p-1"
            onClick={(e) => {
              e.preventDefault();
              table.setPageIndex(0);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={(e) => {
              e.preventDefault();
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={(e) => {
              e.preventDefault();
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="border rounded p-1"
            onClick={(e) => {
              e.preventDefault();
              table.setPageIndex(table.getPageCount() - 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span className="flex items-center gap-1">
            <div>
              Page{' '}
              <strong>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
              </strong>
            </div>
          </span>
        </div>
      )}
    </div>
  );
}
