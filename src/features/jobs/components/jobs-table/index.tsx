'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
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
import JobDialog from '../job-dialog';
import { deleteJob } from '@/features/jobs/lib/services/jobs';
import { TableControlsAndTable } from './table-controls-and-table';

export function JobsTable({ data }: { data: JobType[] }) {
  const [isAddJobOpen, setIsAddJobOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState<JobType | null>(null);
  const [isJobDialogOpen, setIsJobDialogOpen] = React.useState(false);

  const idToDeleteRef = React.useRef<string | null>(null);

  const router = useRouter();

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
      } finally {
        setIsDeleteLoading(false);
        setIsDeleteDialogOpen(false);
      }
    },
    [router],
  );

  const onSelect = React.useCallback((jobDetails: JobType) => {
    setSelectedJob(jobDetails);
    setIsJobDialogOpen(true);
  }, []);

  const onDeleteClick = React.useCallback((id: string) => {
    idToDeleteRef.current = id;
    setIsDeleteDialogOpen(true);
  }, []);

  const onAddClick = React.useCallback(() => {
    setIsAddJobOpen(true);
  }, []);

  return (
    <>
      <TableControlsAndTable
        data={data}
        onAddClick={onAddClick}
        onSelect={onSelect}
        onDeleteClick={onDeleteClick}
      />
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
      <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="mb-4">Save Application</DialogTitle>
            <JobForm setIsAddJobOpen={setIsAddJobOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
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


