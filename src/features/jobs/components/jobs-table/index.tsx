'use client';

import * as React from 'react';
import {
  IconChevronDown,
  IconDotsVertical,
  IconLayoutColumns,
  IconPlus,
} from '@tabler/icons-react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { JobType } from '@/features/jobs/types/job';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import JobForm from '@/features/jobs/components/forms/job-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components/ui/alert-dialog';
import { Spinner } from '../../../../components/ui/spinner';
import { Link } from 'lucide-react';
import JobDialog from '../job-dialog';
import { StatusSelect } from '@/features/jobs/components/status-select';
import { deleteJob } from '@/features/jobs/lib/services/jobs';
import Pagination from './pagination';

export function JobsTable({ data }: { data: JobType[] }) {
  const [isAddJobOpen, setIsAddJobOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState<JobType | null>(null);
  const [isJobDialogOpen, setIsJobDialogOpen] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const idToDeleteRef = React.useRef<string | null>(null);

  const router = useRouter();

  const onSelect = (jobDetails: JobType) => {
    setSelectedJob(jobDetails);
    setIsJobDialogOpen(true);
  };

  const handleDelete = React.useCallback(
    async (id: string | null) => {
      if (!id) return;
      setIsDeleteLoading(true);
      try {
        const res = await deleteJob(id);
        if (res.status === 200) {
          toast.success('Application has been deleted');
          router.refresh();
        } else {
          toast.error('Failed to delete');
        }
      } catch (err) {
        toast.error('Something went wrong');
        console.error(err);
        setIsDeleteLoading(false);
      } finally {
        setIsDeleteDialogOpen(false);
      }
    },
    [router],
  );

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
              <DropdownMenuItem onClick={() => setIsJobDialogOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  idToDeleteRef.current = row.original.id;
                  setIsDeleteDialogOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
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
          <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddJobOpen(true)}
            >
              <IconPlus />
              <span className="hidden lg:inline">Add Application</span>
            </Button>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle className="mb-4">Save Application</DialogTitle>
                <JobForm setIsAddJobOpen={setIsAddJobOpen} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
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
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete your application from the
              server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <Button
              className="w-[73px]"
              onClick={() => handleDelete(idToDeleteRef.current)}
            >
              {isDeleteLoading ? <Spinner /> : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        {selectedJob && (
          <JobDialog
            setIsJobDialogOpen={setIsJobDialogOpen}
            jobData={selectedJob}
          />
        )}
      </Dialog>
    </>
  );
}
