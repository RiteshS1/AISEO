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
        <article className="p-10 md:p-14 bg-slate-900/40 border border-white/10 rounded-[12px] backdrop-blur-sm">
          <span className="text-lime-400 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">
            Learn
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-8">
            The Shift from SEO to AIEO
          </h1>
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed">
              Traditional SEO relies on keywords and backlinks. AI Engine Optimization (AIEO) ensures Large Language Models (LLMs) like ChatGPT and Gemini crawl, understand, and trust your brand entity so they can synthesize it into direct answers.
            </p>
            <p className="text-slate-400 text-[13px] leading-relaxed">
              When users ask AI tools for recommendations, your brand only appears if it is structured for machine understanding: clear entity signals, consistent NAP, schema markup, and topical authority. AIEO is the practice of making your digital presence the definitive source that AI engines cite.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
