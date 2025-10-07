'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import JobForm from '@/features/jobs/components/forms/JobForm';
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <ThemeToggle />
      <Button
        onClick={() => {
          authClient.signOut().then(() => redirect('/auth/sign-in'));
        }}
      >
        Logout
      </Button>
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Add Job</CardTitle>
        </CardHeader>
        <CardContent>
          <JobForm />
        </CardContent>
      </Card>
    </div>
  );
}
