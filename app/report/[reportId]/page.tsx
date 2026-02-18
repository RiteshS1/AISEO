'use client';

import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AuditTool from '@/components/AuditTool';

export default function ReportPage() {
  const params = useParams();
  const reportId = typeof params.reportId === 'string' ? params.reportId : undefined;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-lime-500/30">
      <Navbar />
      <section className="pt-32 pb-20 px-6 relative scroll-mt-20">
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
    </div>
  );
}
