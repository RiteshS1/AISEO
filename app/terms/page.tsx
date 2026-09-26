import Link from 'next/link';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Terms of Service | AISEO by Ritesh',
  description: 'Terms for using AISEO by Ritesh audit and consultation services.',
};

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'the configured contact email';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-lime-500/30">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-28">
        <article className="space-y-10">
          <header>
            <p className="text-lime-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">AISEO by Ritesh Sharma</p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">Terms of Service</h1>
            <p className="text-slate-500 text-xs mt-4">Effective date: September 26, 2026</p>
          </header>
          <section className="space-y-4 text-slate-300 text-sm leading-7">
            <p>These terms govern your use of AISEO by Ritesh Sharma. By using the service, you agree to use it lawfully and provide information you are authorized to submit.</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">The service</h2>
            <p>AISEO accepts business details, creates an audit request, and generates a structured AI-assisted report after administrative approval. Reports are reviewed before publication. Processing times and availability may vary.</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Accounts and submissions</h2>
            <p>You are responsible for keeping your account access secure and for the accuracy and legality of submitted information. Do not submit secrets, regulated data, or information belonging to another person without authorization.</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">AI output limitations</h2>
            <p>Reports are informational and may contain errors, omissions, stale observations, or model-generated conclusions. They are not legal, financial, medical, security, or guaranteed marketing advice. Review outputs independently before acting on them.</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Acceptable use and ownership</h2>
            <p>Do not abuse, probe, disrupt, reverse engineer, or attempt unauthorized access to the service. You retain rights to information you submit. AISEO by Ritesh Sharma retains rights in its software, workflows, interface, and original service materials.</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Availability and changes</h2>
            <p>The service is provided as available and may change, pause, or be discontinued. We may update these terms as the product changes. Continued use after an update indicates acceptance of the revised terms.</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Contact</h2>
            <p>Questions about these terms can be sent to <a className="text-lime-400 underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
          </section>
          <Link href="/" className="inline-block px-6 py-3 bg-lime-400 text-black font-black text-[11px] uppercase tracking-widest rounded-[7px] hover:bg-white transition-all">Back to Home</Link>
        </article>
      </main>
    </div>
  );
}
