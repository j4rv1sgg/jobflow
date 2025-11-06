import { db } from '@/db';
import { documents } from '@/db/schema';
import { auth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { eq, desc } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const docs = await db
      .select()
      .from(documents)
      .where(eq(documents.userId, session.user.id))
      .orderBy(desc(documents.createdAt));

    const docsWithUrls = await Promise.all(
      docs.map(async (doc) => {
        const { data } = await supabase.storage
          .from('documents')
          .createSignedUrl(doc.filePath, 60 * 60 * 24);
        return {
          ...doc,
          downloadUrl: data?.signedUrl ?? null,
        };
      }),
    );

    return NextResponse.json(docsWithUrls, { status: 200 });
  } catch (err) {
    console.error('GET /api/documents failed:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
