import { JobsTable } from '@/features/jobs/components/jobs-table';
import { SiteHeader } from '@/components/site-header';
import { getUserJobs } from '@/features/jobs/lib/queries/jobs';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <h1>Unauthorized</h1>;
  }

  const jobs = await getUserJobs(session.user.id);

  return (
    <>
      <SiteHeader page="Dashboard" />
      <div className="@container/main flex flex-1 flex-col gap-2 py-4 md:gap-6 md:py-6">
        {session && <JobsTable data={jobs} />}
      </div>
    </>
  );
}
