import { SiteHeader } from '@/components/site-header';
import Documents from '@/features/documents/components/documents';
import { headers } from 'next/headers';

export default async function Page() {
  const currentHeaders = await headers();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/documents`, {
    method: 'GET',
    headers: {
      cookie: currentHeaders.get('cookie') || '',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch documents');

  const docData = await res.json();

  return (
    <>
      <SiteHeader page="Documents" />
      <Documents docData={docData} />
    </>
  );
}
