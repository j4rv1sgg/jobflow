import { jobSchema } from '@/features/jobs/lib/validations/job-schema';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  deleteJob,
  getUserJobs,
  postJob,
} from '@/features/jobs/lib/queries/jobs';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing id parameter' },
      { status: 400 },
    );
  }

  try {
    const response = await deleteJob(id);
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error('DELETE /api/jobs failed:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { error: 'Missing id parameter' },
      { status: 400 },
    );
  }

  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const partialSchema = jobSchema.partial();
  const parsed = partialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  try {
    const [updated] = await db
      .update(jobs)
      .set(parsed.data)
      .where(eq(jobs.id, id))
      .returning();

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error('PATCH /api/jobs failed:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
