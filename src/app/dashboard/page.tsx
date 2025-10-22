import { AppSidebar } from '@/components/app-sidebar';
import { JobsTable } from '@/components/jobs-table';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getUserJobs } from '@/features/jobs/lib/queries/jobs';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';


export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <div>Unauthorized</div>;
  }

 const jobs = await getUserJobs(session.user.id);
  
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar userData={session.user} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <JobsTable data={jobs} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
