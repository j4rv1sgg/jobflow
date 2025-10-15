'use server'

import { db } from '@/db';
import { jobs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { JobInputType } from '../validations/job-schema';

export async function getUserJobs(userId: string) {
  return await db
    .select()
    .from(jobs)
    .where(eq(jobs.userId, userId))
    .orderBy(desc(jobs.createdAt));
}

export async function postJob(data: JobInputType & { userId: string }) {
  return await db.insert(jobs).values(data);
}

export async function deleteJob(id: string) {
  return await db.delete(jobs).where(eq(jobs.id, id));
}
