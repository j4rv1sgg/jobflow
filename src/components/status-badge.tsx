import React from 'react';
import { Badge } from './ui/badge';
import { IconCircleCheckFilled, IconLoader } from '@tabler/icons-react';
import { Check, CircleDollarSign, Phone } from 'lucide-react';

type Props = {
  status: 'applied' | 'screening' | 'interview' | 'rejected' | 'offer';
};
export default function StatusBadge({ status }: Props) {
  const renderIcon = () => {
  switch (status) {
    case 'applied':
      return <IconLoader />;
    case 'rejected':
      return <IconCircleCheckFilled/>;
    case 'screening':
      return <Phone />;
    case 'interview':
      return <Check />;
    case 'offer':
      return <CircleDollarSign/>;
    default:
      return null;
  }
};
  return (
    <Badge variant="outline" className="text-muted-foreground px-1.5">
      {renderIcon()} {status}
    </Badge>
  );
}
