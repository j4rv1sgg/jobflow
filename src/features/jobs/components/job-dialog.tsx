import { JobType } from '@/features/jobs/types/job';
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobEditForm from './forms/job-edit-form';
import { format } from 'date-fns';

export default function JobDialog({
  jobData,
  setIsJobDialogOpen,
}: {
  jobData: JobType;
  setIsJobDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DialogContent className="bg-card lg:max-w-[80vw] h-[80vh] overflow-y-auto flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-2xl">{jobData.title}</DialogTitle>
        <DialogDescription className="text-lg">
          {jobData.company}
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="info" className="flex">
        <TabsList>
          <TabsTrigger className="text-lg p-4 cursor-pointer" value="info">
            Info
          </TabsTrigger>
          <TabsTrigger className="text-lg p-4 cursor-pointer" value="edit">
            Edit
          </TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent className="flex" value="info">
          <div className="lg:w-1/2">
            <DialogTitle className="mb-4">Description</DialogTitle>
            <DialogDescription className="whitespace-pre-line text-md p">
              {jobData.description}
            </DialogDescription>
          </div>
          <Separator className="mx-4" orientation="vertical" />
          <div className="lg:w-1/2 text-muted-foreground">
            <p>Applied At: {format(jobData.appliedAt, 'dd/MM/yyyy HH:mm')}</p>
            <p>Updated At: {format(jobData.updatedAt, 'dd/MM/yyyy HH:mm')}</p>
          </div>
        </TabsContent>
        <TabsContent value="edit">
          <JobEditForm
            setIsJobDialogOpen={setIsJobDialogOpen}
            jobData={jobData}
          />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
