import React from 'react';
import { Button } from '@/components/ui/button';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';
import {
  IconDotsVertical,
  IconLayoutColumns,
  IconChevronDown,
  IconPlus,
} from '@tabler/icons-react';
import {
  ColumnFiltersState,
  VisibilityState,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
} from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { JobType } from '../../types/job';
import { StatusSelect } from '../status-select';
import { Pagination } from './pagination';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TableControlsAndTableProps {
  data: JobType[];
  onAddClick: () => void;
  onSelect: (job: JobType) => void;
  onDeleteClick: (id: string) => void;
}

export const TableControlsAndTable = React.memo(function TableControlsAndTable({
  data,
  onAddClick,
  onSelect,
  onDeleteClick,
}: TableControlsAndTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<JobType>[] = React.useMemo(
    () => [
      {
        id: 'drag',
        header: () => null,
      },
      {
        accessorKey: 'link',
        header: 'Link',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            onClick={() => window.open(row.original.link, '_blank')}
            size="icon"
          >
            <Link>{row.original.link}</Link>
          </Button>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Target Job',
        cell: ({ row }) => (
          <div
            onClick={() => onSelect(row.original)}
            className="cursor-pointer"
          >
            {row.original.title}
          </div>
        ),
      },
      {
        accessorKey: 'company',
        header: 'Company',
        cell: ({ row }) => (
          <Badge variant="outline" className="font-bold">
            {row.original.company}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusSelect jobData={row.original} />,
      },
      {
        accessorKey: 'date',
        header: 'Application Date',
        cell: ({ row }) => {
          const appliedAt = row.original.appliedAt;
          if (!appliedAt) return null;

          const exactDate = format(new Date(appliedAt), 'PPpp');
          const relative = formatDistanceToNow(new Date(appliedAt)) + ' ago';

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className=" cursor-default ">{relative}</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{exactDate}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onSelect(row.original)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDeleteClick(row.original.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onSelect, onDeleteClick],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide(),
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={onAddClick}>
            <IconPlus />
            <span className="hidden lg:inline">Add Application</span>
          </Button>
        </div>
      </div>
      <div className=" px-4 lg:px-6 border">
        <Table className="rounded-lg overflow-hidden">
          <TableHeader className="bg-muted sticky top-0 z-10 rounded-lg">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className=" **:data-[slot=table-cell]:first:w-2 **:data-[slot=table-cell]:last:w-2 **:data-[slot=table-cell]:nth-[6]:w-12">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.original.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} />
    </>
  );
});
