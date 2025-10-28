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

export default function JobDialog({ jobData }: { jobData: JobType }) {
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
        <TabsContent className='flex' value="info">
          <div className="w-1/2">
            <DialogTitle className="mb-4">Description</DialogTitle>
            <DialogDescription className='whitespace-pre-line text-md p'>{jobData.description}</DialogDescription>
          </div>
          <Separator className='mx-4' orientation='vertical' />
        </TabsContent>
        <TabsContent value="edit">Edit</TabsContent>
      </Tabs>
    </DialogContent>
  );
}
