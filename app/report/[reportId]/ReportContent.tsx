'use client';

import { useParams } from 'next/navigation';
import AuditTool from '@/components/AuditTool';

export default function ReportContent({ compact = true }: { compact?: boolean }) {
  const params = useParams();
  const reportId = typeof params.reportId === 'string' ? params.reportId : undefined;

  return (
    <section className={`pb-20 px-6 relative scroll-mt-20 ${compact ? 'pt-20' : 'pt-32'}`}>
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#d9ff00 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative max-w-5xl mx-auto">
          <AuditTool initialReportId={reportId} />
        </div>
      </div>
    </section>
  );
}
