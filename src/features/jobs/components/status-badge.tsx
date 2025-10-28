import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IconLoader } from '@tabler/icons-react';
import { Check, CircleDollarSign, Phone, X } from 'lucide-react';
import { JobStatus } from '../types/job';

type Props = {
  status: JobStatus;
  className?: string;
  onClick?: () => void;
};
export default function StatusBadge({ status, ...props }: Props) {
  const renderIcon = () => {
    switch (status) {
      case JobStatus.applied:
        return <IconLoader />;
      case JobStatus.rejected:
        return <X />;
      case JobStatus.screening:
        return <Phone />;
      case JobStatus.interview:
        return <Check />;
      case JobStatus.offer:
        return <CircleDollarSign />;
      default:
        return null;
    }
  };
  return (
    <Badge
      variant="outline"
      className={`text-muted-foreground px-1.5 ${props.className || ''}`}
      {...props}
    >
      {renderIcon()} {status}
    </Badge>
  );
}
