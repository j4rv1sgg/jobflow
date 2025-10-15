'use server'

import { db } from '@/db';
import { jobs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getUserJobs(userId: string) {
  return await db
    .select()
    .from(jobs)
    .where(eq(jobs.userId, userId))
    .orderBy(desc(jobs.createdAt));
}

