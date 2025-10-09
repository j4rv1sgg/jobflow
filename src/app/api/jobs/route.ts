import { jobSchema } from '@/features/jobs/lib/validations/job-schema';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { jobs } from '@/db/schema';

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
  const response = await db.insert(jobs).values({
    ...parsed.data,
    userId: authData.user.id,
    appliedAt: new Date(),
  })
  return NextResponse.json(response, { status: 201 });
}
