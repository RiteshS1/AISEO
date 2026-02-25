'use client'

import AuditTool from '@/components/AuditTool'
import { DEMO_INITIAL_DATA } from '@/components/AuditTool'
import Navbar from '@/components/Navbar'
import { FAQ_ITEMS } from '@/constants/faq'
import { SectionId } from '@/types'
import React, { useEffect, useState } from 'react'

const LANDING_LOADER_MS = 2000

const App: React.FC = () => {
  const [showAllFaq, setShowAllFaq] = useState(false)
  const [auditReady, setAuditReady] = useState(false)
  const [contactSubmitting, setContactSubmitting] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAuditReady(true), LANDING_LOADER_MS)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className='min-h-screen bg-[#020617] text-slate-50 selection:bg-lime-500/30'>
      <Navbar />

      {/* 01. AUDIT TEASER (HERO) */}
      <section id={SectionId.Audit} className='pt-32 pb-20 px-6 relative scroll-mt-20'>
        <div
          className='absolute inset-0 z-0 opacity-[0.03] pointer-events-none'
          style={{ backgroundImage: 'radial-gradient(#d9ff00 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        ></div>

        <div className='max-w-7xl mx-auto relative z-10'>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-3 px-4 py-1 bg-lime-400/10 border border-lime-400/30 text-lime-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 rounded-[7px]'>
              AI Visibility Report
            </div>
            <h1 className='text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.85] uppercase text-white'>
              Do AI Engines <span className='gradient-text'>Show</span> Your Brand?
            </h1>
            <p className='text-base md:text-lg text-slate-500 max-w-3xl mx-auto font-bold uppercase tracking-widest leading-relaxed mb-12'>
              Optimize for the "Synthesized Answer" era. We structure your digital presence so AI models crawl, understand, trust, and reuse your information.
            </p>
          </div>

          <div className='relative max-w-5xl mx-auto min-h-[540px]'>
            {!auditReady ? (
              <div className='w-full min-h-[540px] flex flex-col items-center justify-center p-16 rounded-[7px] border border-white/10 bg-slate-950/80 backdrop-blur-sm'>
                <div className='w-24 h-24 rounded-[12px] bg-white/[0.03] border border-lime-400/20 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(163,230,53,0.12)] animate-pulse'>
                  <span className='text-2xl font-black uppercase tracking-tighter text-lime-400'>AISEO</span>
                </div>
                <div className='w-10 h-10 border-2 border-lime-400/20 border-t-lime-400 animate-spin rounded-full' />
                <p className='text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-6'>Loading report</p>
              </div>
            ) : (
              <AuditTool initialData={DEMO_INITIAL_DATA} isPublicDemo />
            )}
          </div>
        </div>
      </section>

      {/* 02. THE 3 LAYERS OF AIEO */}
      <section id={SectionId.Hero} className='py-24 px-6 relative bg-slate-900/10 border-y border-white/5 scroll-mt-20'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4'>
              The <span className='text-lime-400'>Three Layers</span> of Modern Visibility
            </h2>
            <p className='text-slate-500 text-xs font-black uppercase tracking-[0.3em]'>AIEO integrates discovery across every machine-driven system.</p>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse border border-white/5 rounded-[7px] overflow-hidden'>
              <thead className='bg-white/[0.03] text-[10px] font-black uppercase tracking-widest text-slate-400'>
                <tr>
                  <th className='p-6 border-b border-white/5'>System Type</th>
                  <th className='p-6 border-b border-white/5'>Examples</th>
                  <th className='p-6 border-b border-white/5'>Optimization Focus</th>
                </tr>
              </thead>
              <tbody className='text-[11px] font-bold uppercase tracking-widest'>
                <tr className='border-b border-white/5 hover:bg-white/[0.01] transition-colors'>
                  <td className='p-6 text-white'>Search Engines</td>
                  <td className='p-6 text-slate-500 italic'>Google, Bing</td>
                  <td className='p-6 text-lime-400'>Traditional Rankings (SEO)</td>
                </tr>
                <tr className='border-b border-white/5 hover:bg-white/[0.01] transition-colors'>
                  <td className='p-6 text-white'>Answer Engines</td>
                  <td className='p-6 text-slate-500 italic'>Featured Snippets, Voice Assistants</td>
                  <td className='p-6 text-emerald-400'>Extractable Answers (AEO)</td>
                </tr>
                <tr className='hover:bg-white/[0.01] transition-colors'>
                  <td className='p-6 text-white'>AI Engines (LLMs)</td>
                  <td className='p-6 text-slate-500 italic'>ChatGPT, Gemini, Claude, Perplexity</td>
                  <td className='p-6 text-sky-400'>Citations & Model Usage (AIO)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 03. WHY AIEO MATTERS */}
      <section id={SectionId.Synergy} className='py-32 px-6 bg-slate-950 scroll-mt-20 overflow-hidden'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-20 items-center'>
            <div>
              <span className='text-[10px] text-lime-400 font-bold uppercase tracking-[0.3em] block mb-8'>Why AIEO Matters Now</span>
              <h2 className='text-4xl md:text-7xl font-black mb-10 uppercase tracking-tighter text-white leading-[0.85]'>
                From Clicks <br />
                <span className='text-slate-500'>To Citations.</span>
              </h2>
              <p className='text-lg text-slate-400 mb-12 leading-relaxed font-medium uppercase tracking-wide'>
                Traditional SEO assumes users click links. AI search assumes users read synthesized answers. If your content is not structured for extraction, summarization, and
                entity recognition, AI systems will ignore it—even if you rank.
              </p>

              <div className='space-y-6'>
                <div className='p-8 bg-white/[0.02] border border-white/5 rounded-[7px] flex gap-6 items-start group'>
                  <div className='h-10 w-10 bg-lime-400 flex items-center justify-center font-black text-black text-lg shrink-0 rounded-[7px]'>01</div>
                  <div>
                    <h4 className='font-black text-white text-[11px] uppercase tracking-widest mb-2'>Crawl Layer (SEO Foundation)</h4>
                    <p className='text-slate-400 text-[10px] font-medium uppercase tracking-wider leading-relaxed'>
                      Topic clusters, schema markup, and indexable site architecture.
                    </p>
                  </div>
                </div>
                <div className='p-8 bg-white/[0.02] border border-white/5 rounded-[7px] flex gap-6 items-start group'>
                  <div className='h-10 w-10 bg-emerald-400 flex items-center justify-center font-black text-black text-lg shrink-0 rounded-[7px]'>02</div>
                  <div>
                    <h4 className='font-black text-white text-[11px] uppercase tracking-widest mb-2'>Answer Layer (AEO Structure)</h4>
                    <p className='text-slate-400 text-[10px] font-medium uppercase tracking-wider leading-relaxed'>
                      Q&A formatting, clear entity definitions, and structured How-To blocks.
                    </p>
                  </div>
                </div>
                <div className='p-8 bg-white/[0.02] border border-white/5 rounded-[7px] flex gap-6 items-start group'>
                  <div className='h-10 w-10 bg-sky-400 flex items-center justify-center font-black text-black text-lg shrink-0 rounded-[7px]'>03</div>
                  <div>
                    <h4 className='font-black text-white text-[11px] uppercase tracking-widest mb-2'>AI Knowledge Layer (AIO Signals)</h4>
                    <p className='text-slate-400 text-[10px] font-medium uppercase tracking-wider leading-relaxed'>
                      Topical authority, brand mentions, and trust signals (Authorship/E-E-A-T).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='relative'>
              <div className='absolute -inset-10 bg-lime-400/10 blur-[120px] rounded-full animate-pulse'></div>
              <div className='relative bg-slate-900/40 border border-white/10 p-12 rounded-[7px] backdrop-blur-3xl shadow-2xl'>
                <div className='flex items-center gap-4 mb-10'>
                  <div className='h-0.5 w-8 bg-lime-400'></div>
                  <span className='text-[11px] text-white font-black uppercase tracking-[0.4em]'>Visibility Realities</span>
                </div>

                <div className='space-y-12'>
                  <div className='relative pl-8 border-l border-white/10'>
                    <span className='absolute -left-[5px] top-0 w-2.5 h-2.5 bg-lime-400 rounded-full shadow-[0_0_10px_rgba(217,255,0,0.5)]'></span>
                    <h5 className='text-xs text-white font-black uppercase tracking-widest mb-3'>Understanding Gap</h5>
                    <p className='text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed'>
                      If your brand isn't clear to AI systems, you won't appear in the answers they provide to customers.
                    </p>
                  </div>

                  <div className='relative pl-8 border-l border-white/10'>
                    <span className='absolute -left-[5px] top-0 w-2.5 h-2.5 bg-slate-700 rounded-full'></span>
                    <h5 className='text-xs text-white font-black uppercase tracking-widest mb-3'>Direct Answers</h5>
                    <p className='text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed'>
                      Customers often accept the first business an AI tool recommends. We help ensure that business is yours.
                    </p>
                  </div>

                  <div className='relative pl-8 border-l border-white/10'>
                    <span className='absolute -left-[5px] top-0 w-2.5 h-2.5 bg-slate-700 rounded-full'></span>
                    <h5 className='text-xs text-white font-black uppercase tracking-widest mb-3'>Brand Authority</h5>
                    <p className='text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed'>
                      Being ranked is only the first step. You also need to be a trusted source for information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04. OUR FOCUS */}
      <section id={SectionId.Solution} className='py-32 px-6 bg-black/40 scroll-mt-20'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-black uppercase tracking-tighter text-white'>Full-Funnel AIEO</h2>
            <p className='text-[10px] text-lime-400 font-bold uppercase tracking-[0.3em] mt-2'>Discovery across the entire stack</p>
          </div>
          <div className='grid md:grid-cols-2 gap-12'>
            {[
              {
                title: 'Topical Authority',
                status: 'Attract Searches',
                desc: 'Deep niche coverage using original frameworks, terminology, and unique data that AI engines crave.',
                accent: 'lime-400',
              },
              {
                title: 'Consistent Identity',
                status: 'Confirm Authority',
                desc: 'Unified brand mentions and descriptions across the web to build cross-platform entity confidence.',
                accent: 'emerald-400',
              },
            ].map((box, i) => (
              <div key={i} className='group p-10 border border-white/5 bg-slate-900/50 hover:border-lime-400/30 transition-all rounded-[7px]'>
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] text-${box.accent} block mb-6`}>{box.status}</span>
                <h3 className='text-3xl font-black text-white uppercase tracking-tighter mb-6'>{box.title}</h3>
                <p className='text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed'>{box.desc}</p>
              </div>
            ))}
          </div>

          <div className='mt-16 p-10 bg-lime-400/5 border border-white/5 rounded-[7px] text-center max-w-3xl mx-auto'>
            <h3 className='text-2xl font-black text-white uppercase tracking-tighter mb-6'>AIEO: Defined</h3>
            <p className='text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose'>
              AIEO is the practice of structuring your digital presence so search engines, answer engines, and AI models can easily crawl, understand, trust, and reuse your
              information.
            </p>
          </div>
        </div>
      </section>

      {/* 05. FAQ SECTION (SEO INTEGRATION) */}
      <section id={SectionId.FAQ} className='py-24 px-6 bg-slate-950 scroll-mt-20 border-t border-white/5'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4'>
              Common Questions <span className='text-slate-600'>On AI SEO</span>
            </h2>
            <p className='text-[10px] text-lime-400 font-bold uppercase tracking-[0.3em]'>Synthesized answers to frequent queries</p>
          </div>

          <div className='grid md:grid-cols-2 gap-6 mb-12'>
            {FAQ_ITEMS.map((faq, i) => (
              <div
                key={i}
                className={`p-8 bg-white/[0.02] border border-white/5 rounded-[7px] hover:bg-white/[0.04] transition-colors group ${!showAllFaq && i >= 6 ? 'hidden' : 'block'}`}
              >
                <h4 className='text-sm font-black text-white uppercase tracking-wide mb-4 flex items-start gap-3'>
                  <span className='text-lime-400'>/</span> {faq.q}
                </h4>
                <p className='text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed border-l-2 border-white/10 pl-4 group-hover:border-lime-400/50 transition-colors'>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className='text-center'>
            <button
              onClick={() => setShowAllFaq(!showAllFaq)}
              className='group inline-flex items-center gap-3 px-8 py-4 bg-white/[0.02] border border-white/10 hover:border-lime-400/50 hover:bg-white/[0.05] rounded-[7px] transition-all'
            >
              <span className='text-[10px] font-black uppercase tracking-[0.3em] text-white'>{showAllFaq ? 'Read Less' : 'Read More FAQs'}</span>
              <svg className={`w-4 h-4 text-lime-400 transition-transform duration-300 ${showAllFaq ? 'rotate-180' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 06. CONTACT SECTION */}
      <section id={SectionId.Contact} className='py-32 px-6 relative overflow-hidden scroll-mt-20'>
        <div className='absolute inset-0 bg-gradient-to-br from-lime-400 to-emerald-500 opacity-90'></div>
        <div className='max-w-4xl mx-auto text-center relative z-10'>
          <h2 className='text-5xl md:text-8xl font-black mb-10 uppercase tracking-tighter text-black leading-[0.85]'>
            Improve Your <br /> Visibility.
          </h2>
          <p className='text-xl text-black/80 mb-20 font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed'>
            Ensure your brand is the first recommended option. Contact us for a full AIEO audit and strategy.
          </p>

          <div className='bg-slate-950 p-10 md:p-16 text-left rounded-[7px] shadow-2xl'>
            <form
              className='grid sm:grid-cols-2 gap-10'
              onSubmit={(e) => {
                e.preventDefault()
                setContactSubmitting(true)
                setTimeout(() => setContactSubmitting(false), 1500)
              }}
            >
              <div className='col-span-2 sm:col-span-1'>
                <label className='block text-white/40 text-[10px] font-bold tracking-widest mb-4'>Email address</label>
                <input
                  type='email'
                  className='w-full bg-white/5 border border-white/10 px-6 py-5 text-white font-medium text-sm transition-all rounded-[7px] placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400'
                  placeholder='you@company.com'
                />
              </div>
              <div className='col-span-2 sm:col-span-1'>
                <label className='block text-white/40 text-[10px] font-bold tracking-widest mb-4'>Services of interest</label>
                <div className='relative'>
                  <select className='w-full bg-white/5 border border-white/10 px-6 py-5 text-white font-medium text-sm appearance-none transition-all rounded-[7px] cursor-pointer placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400'>
                    <option value='' disabled className='bg-slate-900 text-white/50'>Select a service...</option>
                    <option className='bg-slate-900' value='combined'>Combined strategy (SEO + AIEO)</option>
                    <option className='bg-slate-900' value='ai'>AI optimization (AIO/AEO)</option>
                    <option className='bg-slate-900' value='seo'>Search engine optimization (SEO)</option>
                  </select>
                </div>
              </div>
              <div className='col-span-2'>
                <label className='block text-white/40 text-[10px] font-bold tracking-widest mb-4'>Message</label>
                <textarea
                  rows={3}
                  className='w-full bg-white/5 border border-white/10 px-6 py-5 text-white font-medium text-sm rounded-[7px] resize-none placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400'
                  placeholder='Tell us about your goals...'
                />
              </div>
              <button type='submit' disabled={contactSubmitting} className='col-span-2 bg-lime-400 text-black font-black py-6 text-sm tracking-widest hover:bg-white transition-all duration-300 rounded-[7px] disabled:opacity-50'>
                {contactSubmitting ? 'Processing...' : 'Request consultation'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className='py-20 border-t border-white/5 bg-black text-center'>
        <div className='flex justify-center items-center gap-2 mb-4'>
          <span className='text-xl font-black uppercase tracking-tighter text-white'>AIEO</span>
          <span className='text-[10px] font-bold text-lime-400 uppercase tracking-widest'>by GetNifty</span>
        </div>
        <p className='text-[10px] font-black uppercase tracking-[0.3em] text-slate-700'>Digital visibility solutions for modern brands.</p>
        <div className='mt-10 flex justify-center gap-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500'>
          <a href='#audit' className='hover:text-lime-400 cursor-pointer transition-colors'>
            Search Results
          </a>
          <a href='#synergy' className='hover:text-lime-400 cursor-pointer transition-colors'>
            AI Content
          </a>
          <a href='/privacy' target='_blank' rel='noopener noreferrer' className='hover:text-lime-400 cursor-pointer transition-colors'>
            Privacy Policy
          </a>
          <a href='/terms' target='_blank' rel='noopener noreferrer' className='hover:text-lime-400 cursor-pointer transition-colors'>
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
