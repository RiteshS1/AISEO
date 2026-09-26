export default function WhyAISEOPage() {
  return (
    <div className="p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <p className="text-lime-400 text-[10px] font-black uppercase tracking-widest mb-4">AISEO by Ritesh</p>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">
          Why AISEO?
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mb-12">
          AISEO turns the emerging world of answer-engine visibility into a clear, reviewable action plan for your brand.
        </p>
        <div className="grid gap-5 md:grid-cols-3 mb-12">
          {[
            ['Crawl', 'Can machines discover and interpret the important parts of your site?'],
            ['Answer', 'Can your pages provide concise, extractable answers to real customer questions?'],
            ['Knowledge', 'Do independent signals consistently establish who you are and what you do?'],
          ].map(([title, copy]) => (
            <section key={title} className="p-6 bg-slate-900/50 border border-white/10 rounded-[7px]">
              <h2 className="text-lime-400 text-sm font-black uppercase tracking-widest mb-3">{title} layer</h2>
              <p className="text-slate-400 text-sm leading-6">{copy}</p>
            </section>
          ))}
        </div>
        <div className="space-y-8 text-slate-400 text-sm leading-7">
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-3">Beyond traditional rankings</h2>
            <p>Traditional SEO helps a page earn a position in a list of links. AISEO also asks whether answer engines can identify your entity, connect it to the right category, and confidently reuse your information in a synthesized response.</p>
          </section>
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-3">Evidence before recommendations</h2>
            <p>AISEO combines technical signals, structured information, topical coverage, identity consistency, and authority indicators. The resulting report is generated only after approval and reviewed before publication so recommendations can be checked for unsupported claims.</p>
          </section>
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-3">A practical workflow</h2>
            <p>Start with an audit, resolve the highest-impact crawl and entity issues, publish useful answer-focused content, and monitor how your brand is represented over time. AI visibility is not a single ranking position and no model can guarantee a recommendation.</p>
          </section>
        </div>
      </div>
    </div>
  );
}