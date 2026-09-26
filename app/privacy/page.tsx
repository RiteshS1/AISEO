import Link from 'next/link';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Privacy Policy | AISEO by Ritesh',
  description: 'How AISEO by Ritesh handles account, audit, and consultation data.',
};

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'the configured contact email';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-lime-500/30">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-28">
        <article className="space-y-10">
          <header>
            <p className="text-lime-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">AISEO by Ritesh Sharma</p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">Privacy Policy</h1>
            <p className="text-slate-500 text-xs mt-4">Effective date: September 26, 2026</p>
          </header>
          <section className="space-y-4 text-slate-300 text-sm leading-7">
            <p>This policy explains how AISEO by Ritesh Sharma handles information when you use the AISEO website, account, audit workflow, or consultation form.</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Information we handle</h2>
            <p>We receive account details supplied through Supabase Auth, including your email and optional profile name. Audit submissions may include a brand name, website, industry, keywords, location, and service categories. Approval requests may include contact details and are stored with the associated report.</p>
            <p>Consultation requests include the email, service selection, and message submitted through the landing page.</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">How information is used</h2>
            <p>Information is used to authenticate you, create and manage audit requests, generate reports after administrative approval, communicate review status, respond to consultation requests, and maintain application security.</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">AI and service providers</h2>
            <p>Approved audit inputs may be sent to Google Gemini or Groq to generate structured audit output. Gemini may use Google Search grounding. Groq is an alternate model provider and may not provide the same grounding sources. Consultation and approval notifications are sent through a private Discord webhook.</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Reports and retention</h2>
            <p>Reports are stored in Supabase. A published report may be accessible through its share URL. Do not submit sensitive personal, financial, health, or confidential information in an audit. We retain information for as long as needed to provide the service, maintain security, resolve disputes, and meet applicable obligations.</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Security and your choices</h2>
            <p>Server-only credentials are kept out of the browser, and administrative actions require authenticated admin access. No internet transmission or storage system can be guaranteed completely secure. Contact us to request access, correction, or deletion of information where applicable.</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Contact</h2>
            <p>For privacy questions or requests, contact <a className="text-lime-400 underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
          </section>
          <Link href="/" className="inline-block px-6 py-3 bg-lime-400 text-black font-black text-[11px] uppercase tracking-widest rounded-[7px] hover:bg-white transition-all">Back to Home</Link>
        </article>
      </main>
    </div>
  );
}
