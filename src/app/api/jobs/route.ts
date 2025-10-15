import { jobSchema } from '@/features/jobs/lib/validations/job-schema';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getUserJobs, postJob } from '@/features/jobs/lib/queries/jobs';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobs = await getUserJobs(session.user.id);
    return NextResponse.json(jobs);
  } catch (err) {
    console.error('GET /api/jobs failed:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = jobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  try {
    const response = await postJob({
      ...parsed.data,
      userId: authData.user.id,
    });
    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error('POST /api/jobs failed:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
