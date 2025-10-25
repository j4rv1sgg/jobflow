import { JobType } from '@/features/jobs/types/job';
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Separator } from './ui/separator';

export default function JobDetails({ jobData }: { jobData: JobType }) {
  return (
    <DialogContent className="bg-card max-w-80vw max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{jobData.title}</DialogTitle>
        <DialogDescription>{jobData.company}</DialogDescription>
      </DialogHeader>
      <Separator />
      <DialogDescription>{jobData.description}</DialogDescription>
    </DialogContent>
  );
}
