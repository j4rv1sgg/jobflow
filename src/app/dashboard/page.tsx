"use client";

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
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
    </div>
  );
}
