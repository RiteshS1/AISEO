export default function WhyGetNiftyPage() {
  return (
    <div className="p-8 md:p-12">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#d9ff00 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="p-10 md:p-14 bg-slate-900/40 border border-white/10 rounded-[12px] backdrop-blur-sm">
          <span className="text-lime-400 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">
            About
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-8">
            Why Partner With GetNifty?
          </h1>
          <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed mb-8">
            We are the premier AI visibility agency. We don&apos;t just audit; we execute. From advanced Schema.org mapping to semantic authority building, we ensure your brand is the definitive answer in the AI era.
          </p>
          <ul className="space-y-4 text-slate-400 text-[13px] leading-relaxed list-none">
            <li className="flex items-start gap-3">
              <span className="text-lime-400 font-black shrink-0">01</span>
              <span>Advanced Schema.org and entity mapping so LLMs can parse your brand correctly.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lime-400 font-black shrink-0">02</span>
              <span>Semantic authority and topical depth that AI engines prioritize.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lime-400 font-black shrink-0">03</span>
              <span>End-to-end execution: from audit to implementation, not just reports.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
