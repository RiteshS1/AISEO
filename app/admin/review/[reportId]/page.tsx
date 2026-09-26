import { requireAdmin } from '@/lib/adminServer';
import AdminReviewClient from './AdminReviewClient';
import { redirect } from 'next/navigation';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminReviewPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 401) {
      redirect('/login?next=/admin');
    }
    redirect('/dashboard');
  }
  const { reportId } = await params;
  return <AdminReviewClient reportId={reportId} />;
}
