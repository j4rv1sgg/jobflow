'use client'

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { data: session } = authClient.useSession();
  if(!session) {
    redirect('/auth/sign-in')
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={() => authClient.signOut()}>Logout</Button>

    </div>
  )
}
