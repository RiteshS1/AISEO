import type { ReportStatus } from '@/lib/supabaseServer';

const stages: { status: ReportStatus; label: string }[] = [
  { status: 'pending_approval', label: 'Awaiting admin review' },
  { status: 'generating', label: 'AI engine analyzing' },
  { status: 'in_review', label: 'Quality verification' },
  { status: 'published', label: 'Report ready' },
];

export default function ReportStatusTracker({ status }: { status: ReportStatus }) {
  if (status === 'draft') {
    return <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Draft saved</p>;
  }
  if (status === 'rejected') {
    return <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">Request rejected</p>;
  }

  const activeIndex = stages.findIndex((stage) => stage.status === status);
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label={`Report status: ${status}`}>
      {stages.map((stage, index) => {
        const complete = index <= activeIndex;
        return (
          <span
            key={stage.status}
            className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-[4px] ${
              complete ? 'border-lime-400/40 text-lime-400' : 'border-white/10 text-slate-600'
            }`}
          >
            {stage.label}
          </span>
        );
      })}
    </div>
  );
}