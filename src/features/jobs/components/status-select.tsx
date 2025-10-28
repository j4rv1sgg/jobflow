import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import StatusBadge from './status-badge';
import { JobStatus, JobType } from '../types/job';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

const statuses = Object.values(JobStatus);

export function StatusSelect({ jobData }: { jobData: JobType }) {
  const [value, setValue] = React.useState(jobData.status);

  const handleChange = async (value: JobStatus) => {
    try {
      setValue(value);
      await api.patch(`/jobs?id=${jobData.id}`, {
        status: value,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
      setValue((prev) => prev);
    }
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger
        icon={false}
        size="sm"
        className="w-content border-none p-0 cursor-pointer"
      >
        <StatusBadge status={value} />
      </SelectTrigger>
      <SelectContent className="w-content">
        {statuses.map((status) => (
          <SelectItem key={status} value={status} className="cursor-pointer">
            <StatusBadge status={status} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
