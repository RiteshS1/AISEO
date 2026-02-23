export default function UnderstandingAIEOPage() {
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
            Learn
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">
            Understanding AIEO
          </h1>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
            Content and resources will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}
