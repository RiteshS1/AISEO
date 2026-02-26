import { AUDIT_FORM_QUESTIONS } from '@/constants/auditForm'
import { REPORT_NAV_ITEMS } from '@/constants/reportTabs'
import type { AuditInputs } from '@/lib/schemas/auditInputs'
import { AuditResult } from '@/types'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'

type AuditStep = 'INPUT' | 'SCANNING' | 'GATE' | 'FINALIZING' | 'COMPLETE'
type ReportPage = 'COVER' | 'SUMMARY' | 'ANALYTICS' | 'DIAGNOSTIC' | 'SOCIAL' | 'PILLARS' | 'ROADMAP'

export interface AuditToolInitialData {
  result: AuditResult
  inputs: AuditInputs
}

const SCANNING_MESSAGES = [
  'Crawling entity data...',
  'Synthesizing AI visibility score...',
  'Analyzing search pillars...',
  'Mapping brand signals...',
  'Aggregating AI sentiments...',
]

function ScanningStep({ loadingProgress }: { loadingProgress: number }) {
  const [messageIndex, setMessageIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => {
      setMessageIndex((i) => (i + 1) % SCANNING_MESSAGES.length)
    }, 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className='flex flex-col items-center justify-center p-8 sm:p-12 md:p-20 text-center relative z-10 min-h-[600px] overflow-hidden'>
      <div
        className='absolute left-0 right-0 h-8 w-full bg-gradient-to-b from-transparent via-lime-400/50 to-lime-500 border-b-2 border-lime-400 shadow-[0_4px_30px_#a3e635]'
        style={{ animation: 'scan-sweep 3.5s ease-in-out infinite' }}
      />
      <div className='relative z-10 flex flex-col items-center w-full max-w-lg'>
        <div className='w-16 h-16 border-2 border-lime-400/30 border-t-lime-400 animate-spin rounded-full mb-10 shadow-[0_0_30px_rgba(163,230,53,0.2)]' />
        <h3 className='text-lg sm:text-xl md:text-2xl font-black uppercase tracking-widest mb-4 text-white'>Scanning</h3>
        <p className='text-lime-400/90 text-[11px] font-black uppercase tracking-[0.3em] mb-10 min-h-[1.5em] transition-opacity duration-500'>
          {SCANNING_MESSAGES[messageIndex]}
        </p>
        <div className='w-full max-w-md'>
          <div className='h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner'>
            <div
              className='h-full bg-lime-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_20px_rgba(163,230,53,0.5)]'
              style={{ width: `${Math.min(loadingProgress, 100)}%` }}
            />
          </div>
          <p className='text-[9px] text-slate-500 font-black uppercase tracking-widest mt-3'>{Math.round(loadingProgress)}%</p>
        </div>
      </div>
    </div>
  )
}

const MOCK_DEMO_RESULT: AuditResult = {
  overallScore: 42,
  searchVisibilityIndex: 78,
  aiVisibilityIndex: 12,
  hallucinationRisk: 15,
  logicIntegrity: 89,
  foundation: {
    score: 45,
    status: 'Average',
    summary:
      'Red Bull has strong traditional SEO and a recognizable global brand, but AI Answer Engines still lack the structured data (schema, FAQ blocks) needed to surface its energy drinks and events reliably. AI visibility is currently driven more by search and existing brand mentions than by proactive entity and product data. To stay ahead in the beverage and sports-content space, investing in structured product and event data and knowledge graph presence is essential.',
    entityConfidence: 62,
    napConsistency: '92% - Mostly consistent across the web.',
    schemaValidation: 'Valid schema found, but missing specific service details.',
    knowledgeGraph: 'Partial',
  },
  technical: {
    score: 82,
    status: 'Optimal',
    summary: 'Technical infrastructure is fast and responsive, which satisfies the Crawl Layer requirements.',
    coreWebVitals: 'Passed',
    pageSpeed: 94,
    mobileHealth: 'High',
  },
  aiBreakdown: [
    {
      name: 'ChatGPT-4o',
      visibilityScore: 18,
      recommendationLikelihood: 8,
      brandAuthority: 32,
      citationCount: 3,
      sentiment: 'Neutral',
      keyTakeaway: 'Recognized as a brand but rarely selected as a top recommendation.',
    },
    {
      name: 'Gemini 1.5 Pro',
      visibilityScore: 12,
      recommendationLikelihood: 4,
      brandAuthority: 22,
      citationCount: 1,
      sentiment: 'Neutral',
      keyTakeaway: 'Heavily reliant on Google Search data which limits proactive discovery.',
    },
    {
      name: 'Perplexity',
      visibilityScore: 45,
      recommendationLikelihood: 28,
      brandAuthority: 52,
      citationCount: 10,
      sentiment: 'Positive',
      keyTakeaway: 'Better indexing here due to strong blog content structure.',
    },
  ],
  pillarAnalysis: [
    { title: 'Crawl Layer', score: 85, evaluation: 'Strong architecture and indexability. The site is easy for crawlers to navigate.' },
    { title: 'Answer Layer', score: 30, evaluation: 'Missing Q&A blocks and FAQ schema. Not optimized for direct extraction.' },
    { title: 'AI Knowledge', score: 15, evaluation: "Weak entity signals. AI models aren't seeing your unique terminology or data." },
    { title: 'Brand Identity', score: 65, evaluation: 'Consistent NAP, but lacks high-authority external brand mentions.' },
    { title: 'Trust Signals', score: 40, evaluation: 'Authorship and expert credentials are not clearly mapped in the code.' },
  ],
  technicalChecklist: [
    { point: 'Entity Identity', status: 'Pass', observation: 'Brand name and domain are clearly linked.' },
    { point: 'NAP Consistency', status: 'Pass', observation: 'Address and phone are consistent on most platforms.' },
    { point: 'Google Business', status: 'Pass', observation: 'Profile is verified and has active reviews.' },
    { point: 'Bing Places', status: 'Pass', observation: 'Information matches your Google profile.' },
    { point: 'Apple Maps', status: 'Warning', observation: 'Some location photos are outdated.' },
    { point: 'Schema.org', status: 'Warning', observation: 'Service area information is missing.' },
    { point: 'Knowledge Graph', status: 'Fail', observation: 'No unique ID found in major AI knowledge bases.' },
    { point: 'FAQ Blocks', status: 'Fail', observation: 'No structured Q&A content for Answer Engines.' },
    { point: 'Topic Clusters', status: 'Warning', observation: 'Internal linking is shallow, diluting topical authority.' },
    { point: 'Fast LCP', status: 'Pass', observation: 'Page speed is optimal for user experience.' },
    { point: 'Mobile Readiness', status: 'Pass', observation: 'Fully responsive across all devices.' },
    { point: 'Semantic Markup', status: 'Warning', observation: 'Header hierarchy could be more descriptive.' },
    { point: 'Robots.txt', status: 'Pass', observation: 'AI crawlers are not being blocked.' },
    { point: 'XML Sitemap', status: 'Pass', observation: 'Sitemap is current and readable.' },
    { point: 'E-E-A-T Proof', status: 'Warning', observation: 'Expertise signals are visually present but not coded.' },
    { point: 'Original Data', status: 'Fail', observation: 'No proprietary datasets or frameworks found.' },
    { point: 'Internal Linking', status: 'Warning', observation: 'Anchor text is generic in many places.' },
    { point: 'Social Authority', status: 'Pass', observation: 'Active profiles linked to main domain.' },
    { point: 'Entity Linkage', status: 'Warning', observation: 'Founder profiles not linked to brand entity.' },
    { point: 'Wikipedia Mention', status: 'Fail', observation: 'No references found in community knowledge sets.' },
    { point: 'G2/Capterra', status: 'Fail', observation: 'Missing B2B trust citations.' },
    { point: 'Schema Services', status: 'Warning', observation: 'Service specific JSON-LD could be deeper.' },
  ],
  socialFootprint: [
    { platform: 'Instagram', presence: 'Medium', sentiment: 'Positive', observation: 'Focuses on visual project showcases.' },
    { platform: 'Facebook', presence: 'High', sentiment: 'Positive', observation: 'High engagement in community groups.' },
    { platform: 'LinkedIn', presence: 'High', sentiment: 'Professional', observation: 'Strong company presence and leadership posts.' },
    { platform: 'TikTok', presence: 'Low', sentiment: 'Neutral', observation: 'Experimental short-form content.' },
    { platform: 'X (Twitter)', presence: 'None', sentiment: 'None', observation: 'No official brand activity found.' },
    { platform: 'Reddit', presence: 'Low', sentiment: 'Mixed', observation: 'Organic mentions in industry-specific subs.' },
  ],
  authority: {
    score: 55,
    status: 'Average',
    summary: "Brand authority is largely internal. AI engines need more 'second-party' validation of your expertise.",
    referringDomains: 450,
    sentimentScore: 72,
    trustSignals: ['G2 Rating', 'BBB Accredited'],
  },
  traditionalRankings: [],
  competitors: [{ name: 'Monster Energy', visibilityScore: 88, primaryStrength: 'High search and AI visibility in energy drink category', threatLevel: 'High' }],
  globalRecommendations: [
    { title: 'Implement FAQ Blocks', action: 'Convert service FAQs into structured data blocks for Answer Engines.', priority: 'High', timeline: '1 Week' },
    { title: 'Strengthen Entity Graph', action: 'Link executive profiles and proprietary frameworks to the main brand entity.', priority: 'High', timeline: '3 Weeks' },
    { title: 'Original Data Assets', action: 'Publish unique industry data or terminology to improve AI Knowledge citations.', priority: 'Medium', timeline: '2 Months' },
  ],
  sources: [],
}

const DEMO_INPUTS: AuditInputs = {
  brandName: 'Red Bull',
  industry: 'Food & Beverage',
  websiteUrl: 'www.redbull.com',
  keywords: 'energy drink, Red Bull, wings, sports events',
  location: 'Austria',
  serviceCategories: 'Food & Beverage',
}

export const DEMO_INITIAL_DATA: AuditToolInitialData = {
  inputs: DEMO_INPUTS,
  result: MOCK_DEMO_RESULT,
}

interface AuditToolProps {
  initialData?: AuditToolInitialData
  initialReportId?: string
  isPublicDemo?: boolean
  isAdminView?: boolean
  /** When true (e.g. public /report/[id] page), tabs are unlocked but "Back to Audit" is hidden for a read-only deliverable. */
  isPublicReportPage?: boolean
  /** Prefill for Gate step when user is authenticated (e.g. from dashboard). */
  prefillContactName?: string
}

const AuditTool: React.FC<AuditToolProps> = ({ initialData, initialReportId, isPublicDemo, isAdminView, isPublicReportPage, prefillContactName }) => {
  const formDataInitial: AuditInputs = initialData?.inputs ?? {
    brandName: '',
    industry: '',
    websiteUrl: '',
    keywords: '',
    location: '',
    serviceCategories: '',
  }
  const [step, setStep] = useState<AuditStep>('INPUT')
  const [activePage, setActivePage] = useState<ReportPage>('COVER')
  const [formStep, setFormStep] = useState(0)
  const [formData, setFormData] = useState<AuditInputs>(formDataInitial)
  const [otherService, setOtherService] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [fullName, setFullName] = useState(prefillContactName ?? '')
  const [result, setResult] = useState<AuditResult | null>(initialData?.result ?? null)
  const [reportId, setReportId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [pendingReviewMessage, setPendingReviewMessage] = useState(false)
  const [gateSubmitting, setGateSubmitting] = useState(false)
  const [auditSubmitting, setAuditSubmitting] = useState(false)
  const [demoResolved, setDemoResolved] = useState(!isPublicDemo)

  const inputRef = useRef<HTMLInputElement>(null)
  const reportRef = useRef<HTMLDivElement>(null)
  const analysisStartedRef = useRef(false)

  // Hydrate from initialData (e.g. /report/[id] page or public demo) — avoid FOUC by resolving before showing form
  useEffect(() => {
    if (initialData) {
      setFormData(initialData.inputs)
      setResult(initialData.result)
      setStep('COMPLETE')
      setActivePage('COVER')
      if (isPublicDemo) setDemoResolved(true)
    }
  }, [initialData, isPublicDemo])

  // Fetch report by ID when initialReportId is provided (client-side fetch for report page)
  useEffect(() => {
    if (!initialReportId || initialData || result) return
    const controller = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(`/api/report/${initialReportId}`, { signal: controller.signal })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Report not found')
        setFormData(json.inputs)
        setResult(json.result)
        setReportId(initialReportId)
        setStep('COMPLETE')
        setActivePage('COVER')
      } catch (e) {
        if ((e as Error).name !== 'AbortController') {
          setError('Report not found or could not be loaded.')
        }
      }
    })()
    return () => controller.abort()
  }, [initialReportId, initialData, result])

  const handleLoadDemo = () => {
    setFormData({
      brandName: 'Red Bull',
      industry: 'Food & Beverage',
      websiteUrl: 'www.redbull.com',
      keywords: 'energy drink, Red Bull, wings, sports events',
      location: 'Austria',
      serviceCategories: 'Food & Beverage',
    })
    setOtherService('')
    setResult(MOCK_DEMO_RESULT)
    setStep('COMPLETE')
    setActivePage('COVER')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError('')
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const nextFormStep = () => {
    setError('')
    const field = AUDIT_FORM_QUESTIONS[formStep]?.name
    if (field && !formData[field]) {
      setError('This field is required')
      return
    }
    if (formStep < AUDIT_FORM_QUESTIONS.length - 1) setFormStep((prev) => prev + 1)
    else {
      setAuditSubmitting(true)
      setResult(null)
      setStep('SCANNING')
    }
  }

  const prevFormStep = () => {
    setError('')
    if (formStep > 0) setFormStep((prev) => prev - 1)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      nextFormStep()
    }
  }

  // Logic to run analysis (single run per SCANNING session via ref)
  useEffect(() => {
    if (step !== 'SCANNING' || result || analysisStartedRef.current) return
    analysisStartedRef.current = true
    const runAnalysis = async () => {
      const resolvedServiceCategories =
        formData.serviceCategories === 'Other'
          ? (otherService.trim() || 'Other')
          : formData.serviceCategories
      const payload = { ...formData, serviceCategories: resolvedServiceCategories }
      try {
        const res = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json.error ?? 'Audit failed')
        }
        setResult(json.result)
        if (json.reportId) setReportId(json.reportId)
      } catch (e) {
        console.error('Analysis failed', e)
        setAuditSubmitting(false)
        setStep('INPUT')
        setError('The report could not be generated. Please check your internet connection and try again.')
      } finally {
        analysisStartedRef.current = false
      }
    }
    runAnalysis()
  }, [step, result, formData, otherService])

  // Logic for progress bar animation
  useEffect(() => {
    if (step === 'SCANNING') {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          // If we have a result, speed up to 100%
          const increment = result ? 8 : Math.random() * 2
          const next = prev + increment

          // If result is not ready, stall at 90%
          if (!result && next > 90) return 90

          if (next >= 100) return 100
          return next
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [step, result])

  // Logic to transition to GATE once scanning is visually done and data is ready
  useEffect(() => {
    if (step === 'SCANNING' && loadingProgress >= 100 && result) {
      const t = setTimeout(() => setStep('GATE'), 500)
      return () => clearTimeout(t)
    }
  }, [step, loadingProgress, result])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName?.trim()) {
      setError('Full name is required.')
      return
    }
    if (!userEmail) return
    if (!reportId) {
      setError('Report is not ready. Please try again.')
      return
    }
    setGateSubmitting(true)
    setStep('FINALIZING')
    setLoadingProgress(0)
    setError('')

    try {
      const res = await fetch('/api/request-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: fullName.trim(),
          email: userEmail,
          brandName: formData.brandName,
          industry: formData.industry,
          websiteUrl: formData.websiteUrl,
          keywords: formData.keywords,
          reportId,
        }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError((json as { error?: string }).error ?? 'Something went wrong. Please try again.')
        setStep('GATE')
        setGateSubmitting(false)
        return
      }
      setPendingReviewMessage(true)
    } catch (err) {
      console.error('Signup error', err)
      setError('Something went wrong. Please try again.')
      setStep('GATE')
      setGateSubmitting(false)
      return
    }
    setGateSubmitting(false)
    setStep('COMPLETE')
    setActivePage('COVER')
  }

  const radarData =
    result?.pillarAnalysis && result.pillarAnalysis.length > 0
      ? result.pillarAnalysis.map((p) => ({
          subject: p.title,
          A: p.score,
          fullMark: 100,
        }))
      : [
          { subject: 'Crawl', A: 0, fullMark: 100 },
          { subject: 'Answer', A: 0, fullMark: 100 },
          { subject: 'AI Knowledge', A: 0, fullMark: 100 },
          { subject: 'Identity', A: 0, fullMark: 100 },
          { subject: 'Trust', A: 0, fullMark: 100 },
        ]

  const isRestricted = (page: ReportPage) =>
    isAdminView ? false : page !== 'COVER' && page !== 'SUMMARY'

  return (
    <div className='w-full p-0.5 bg-gradient-to-r from-lime-400 via-emerald-400 to-lime-400 shadow-neon rounded-[7px]'>
      <div className='w-full bg-slate-950 border border-white/5 min-h-[600px] flex flex-col relative overflow-hidden rounded-[7px]'>
        {isPublicDemo && !demoResolved && (
          <div className='min-h-[600px] flex flex-col items-center justify-center p-20 relative z-20'>
            <div className='absolute inset-0 bg-slate-950/80 backdrop-blur-sm' />
            <div className='relative z-10 flex flex-col items-center justify-center'>
              <div className='w-20 h-20 rounded-[12px] bg-white/[0.03] border border-lime-400/20 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(163,230,53,0.15)] animate-pulse'>
                <span className='text-2xl font-black uppercase tracking-tighter text-lime-400'>AISEO</span>
              </div>
              <div className='w-12 h-12 border-2 border-lime-400/20 border-t-lime-400 animate-spin rounded-full' />
              <p className='text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-6'>Loading report</p>
            </div>
          </div>
        )}
        {!(isPublicDemo && !demoResolved) && step === 'INPUT' && (
          <div className='max-w-xl mx-auto w-full p-6 sm:p-10 md:p-16 min-h-[540px] flex flex-col justify-center animate-in fade-in duration-500 relative z-10'>
            <div className='flex gap-1 mb-8 md:mb-12'>
              {AUDIT_FORM_QUESTIONS.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-700 ${i <= formStep ? 'bg-lime-400' : 'bg-white/5'}`} />
              ))}
            </div>
            <div key={formStep} className='animate-in fade-in slide-in-from-right-4 duration-500'>
              <h2 className='text-2xl md:text-3xl font-black mb-1 uppercase tracking-tighter text-white'>{AUDIT_FORM_QUESTIONS[formStep].label}</h2>
              <p className='text-[10px] text-slate-500 mb-8 md:mb-10 font-bold uppercase tracking-widest'>{AUDIT_FORM_QUESTIONS[formStep].desc}</p>
              {AUDIT_FORM_QUESTIONS[formStep].name === 'serviceCategories' ? (
                <>
                  <select
                    name='serviceCategories'
                    value={formData.serviceCategories}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className='w-full bg-slate-900/50 border border-slate-700 py-4 px-4 text-sm text-white font-bold tracking-tight rounded-[7px] focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400 appearance-none cursor-pointer'
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem', paddingRight: '2.5rem' }}
                  >
                    <option value='' disabled className='bg-slate-900 text-white'>Select your industry / primary service...</option>
                    <option value='Software & Technology (SaaS)' className='bg-slate-900 text-white'>Software & Technology (SaaS)</option>
                    <option value='E-commerce & Retail' className='bg-slate-900 text-white'>E-commerce & Retail</option>
                    <option value='Healthcare & Wellness' className='bg-slate-900 text-white'>Healthcare & Wellness</option>
                    <option value='Financial Services' className='bg-slate-900 text-white'>Financial Services</option>
                    <option value='Real Estate & Construction' className='bg-slate-900 text-white'>Real Estate & Construction</option>
                    <option value='Professional Services (Legal, Consulting)' className='bg-slate-900 text-white'>Professional Services (Legal, Consulting)</option>
                    <option value='Education & E-Learning' className='bg-slate-900 text-white'>Education & E-Learning</option>
                    <option value='Travel & Hospitality' className='bg-slate-900 text-white'>Travel & Hospitality</option>
                    <option value='Home Services & Trades' className='bg-slate-900 text-white'>Home Services & Trades</option>
                    <option value='Manufacturing & Logistics' className='bg-slate-900 text-white'>Manufacturing & Logistics</option>
                    <option value='Other' className='bg-slate-900 text-white'>Other</option>
                  </select>
                  {formData.serviceCategories === 'Other' && (
                    <input
                      type='text'
                      value={otherService}
                      onChange={(e) => setOtherService(e.target.value)}
                      placeholder='Please specify your industry/service...'
                      className='w-full bg-slate-900/50 border border-slate-700 rounded-[7px] px-4 py-3 mt-3 text-sm text-white placeholder:text-white/40 font-medium focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400'
                    />
                  )}
                </>
              ) : (
                <input
                  ref={inputRef}
                  name={AUDIT_FORM_QUESTIONS[formStep].name}
                  value={formData[AUDIT_FORM_QUESTIONS[formStep].name]}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder={AUDIT_FORM_QUESTIONS[formStep].placeholder}
                  className='w-full bg-transparent border-b border-white/10 py-4 text-lg sm:text-xl md:text-2xl text-white transition-all placeholder:text-white/40 font-bold tracking-tight focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400'
                />
              )}
              {error && <p className='text-red-500 text-[9px] font-black uppercase mt-4 tracking-widest'>{error}</p>}
              <div className='flex flex-wrap gap-4 mt-12'>
                <button
                  type='button'
                  onClick={nextFormStep}
                  disabled={auditSubmitting}
                  className='px-10 py-5 bg-lime-400 text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all rounded-[7px] disabled:opacity-50'
                >
                  {auditSubmitting ? 'Processing...' : formStep === AUDIT_FORM_QUESTIONS.length - 1 ? 'Analyze Brand' : 'Next'}
                </button>
                <button
                  onClick={handleLoadDemo}
                  className='px-10 py-5 border border-white/10 text-white font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all rounded-[7px]'
                >
                  Load Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {!(isPublicDemo && !demoResolved) && step === 'SCANNING' && (
          <ScanningStep loadingProgress={loadingProgress} />
        )}

        {!(isPublicDemo && !demoResolved) && step === 'GATE' && (
          <div className='grid md:grid-cols-2 animate-in fade-in slide-in-from-bottom-6 duration-1000 relative z-10 min-h-[600px]'>
            <div className='p-6 sm:p-10 md:p-20 border-r border-white/5 bg-slate-900/10'>
              <span className='text-lime-400 text-[9px] font-black uppercase tracking-[0.4em] block mb-10'>Analysis Complete</span>
              <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8 uppercase tracking-tighter text-white leading-[0.85]'>
                Results <br />
                Ready.
              </h2>
              <p className='text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-sm'>
                The visibility report for <span className='text-white font-black'>{formData.brandName}</span> is now available for review.
              </p>
            </div>
            <div className='p-6 sm:p-10 md:p-20 flex flex-col justify-center bg-white/[0.01]'>
              <h3 className='text-lg sm:text-xl font-black uppercase tracking-tight mb-2 text-white'>Open the Findings</h3>
              <p className='text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 md:mb-12'>Confirm your details to see the full analysis.</p>
              <form onSubmit={handleSignup} className='space-y-6'>
                <input
                  type='text'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder='Full Name'
                  className='w-full bg-black/40 border border-white/10 px-8 py-6 text-white transition-all text-[11px] font-bold rounded-[7px] placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400'
                  required
                />
                <input
                  type='email'
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder='you@company.com'
                  className='w-full bg-black/40 border border-white/10 px-8 py-6 text-white transition-all text-[11px] font-bold rounded-[7px] placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400'
                  required
                />
                {error && <p className='text-red-500 text-[9px] font-black uppercase tracking-widest'>{error}</p>}
                <button type='submit' disabled={gateSubmitting} className='w-full py-6 bg-lime-400 text-black font-black text-[11px] tracking-widest hover:bg-white transition-all rounded-[7px] disabled:opacity-50'>
                  {gateSubmitting ? 'Processing...' : 'Access Report'}
                </button>
              </form>
            </div>
          </div>
        )}

        {!(isPublicDemo && !demoResolved) && step === 'FINALIZING' && (
          <div className='flex flex-col items-center justify-center p-8 sm:p-12 md:p-20 text-center relative z-10 min-h-[600px]'>
            <div className='w-20 h-20 border-4 border-lime-400/5 border-t-lime-400 animate-spin rounded-full mb-12'></div>
            <h3 className='text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mb-4'>Finalizing Analysis</h3>
          </div>
        )}

        {!(isPublicDemo && !demoResolved) && step === 'COMPLETE' && result && (
          <div className='flex flex-col md:flex-row min-h-[800px] animate-in fade-in duration-1000'>
            {/* Mobile: tab dropdown at top of report */}
            <div className='block md:hidden p-4 border-b border-white/5 bg-slate-900/10'>
              <select
                value={activePage}
                onChange={(e) => setActivePage(e.target.value as ReportPage)}
                className='w-full bg-black/40 border border-white/10 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white rounded-[7px] focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400 appearance-none cursor-pointer'
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem', paddingRight: '2.5rem' }}
              >
                {REPORT_NAV_ITEMS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Desktop: vertical sidebar */}
            <div className='hidden md:flex w-full md:w-72 border-r border-white/5 bg-slate-900/10 flex-col p-8 shrink-0'>
              {pendingReviewMessage && (
                <p className='text-lime-400 text-[10px] font-bold uppercase tracking-widest mb-6'>
                  Success! Our experts are reviewing your custom report. You will receive it in your inbox shortly.
                </p>
              )}
              <div className='mb-12'>
                <span className='text-lime-400 text-[9px] font-black uppercase tracking-[0.5em] block mb-2'>Audit Report</span>
                <h4 className='text-white font-black uppercase tracking-tighter text-xl truncate' title={formData.brandName}>{formData.brandName}</h4>
              </div>

              <div className='flex-1 space-y-2'>
                {REPORT_NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-[7px] transition-all ${activePage === item.id ? 'bg-lime-400 text-black shadow-[0_4px_20px_rgba(217,255,0,0.2)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                  >
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d={item.icon} />
                    </svg>
                    {item.label}
                  </button>
                ))}
              </div>

              {!isPublicDemo && !isPublicReportPage && (
                <button
                  type='button'
                  onClick={() => {
                    setStep('INPUT')
                    setFormStep(0)
                    setResult(null)
                    setActivePage('COVER')
                  }}
                  className='w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 text-[10px] font-black uppercase tracking-widest rounded-[7px] transition-all text-slate-500 hover:text-white hover:bg-white/5'
                >
                  <svg className='w-3 h-3 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
                  </svg>
                  Back to Audit
                </button>
              )}

              <div className='mt-auto pt-10 border-t border-white/5 text-center'>
                <p className='text-[8px] text-slate-600 font-black uppercase tracking-[0.2em]'>© 2025 GetNifty AIEO Analytics</p>
              </div>
            </div>

            <div ref={reportRef} className='flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto max-h-[800px] relative bg-slate-950 report-content flex flex-col'>
              {isRestricted(activePage) && (
                <div className='absolute inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 md:p-12 text-center bg-slate-950/40 backdrop-blur-3xl animate-in fade-in duration-500'>
                  <div className='max-w-md p-6 sm:p-8 md:p-10 bg-slate-900/90 border border-white/10 rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group'>
                    <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-400 via-emerald-400 to-lime-400'></div>
                    <div className='mb-6 md:mb-8'>
                      <div className='w-16 h-16 bg-lime-400/10 border border-lime-400/30 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6'>
                        <svg className='w-8 h-8 text-lime-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                          />
                        </svg>
                      </div>
                      <h3 className='text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-4'>
                        {isPublicDemo ? 'Register to unlock full access' : 'Report Restricted'}
                      </h3>
                      {isPublicDemo ? (
                        <p className='text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed mb-6'>
                          Create an account to run your own audit and access the full 22-point report.
                        </p>
                      ) : (
                        <>
                          <p className='text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed mb-4'>
                            We&apos;ve sent the complete high-fidelity 22-point PDF audit to your inbox.
                          </p>
                          <p className='text-[10px] text-lime-400 font-black uppercase tracking-widest'>
                            Check <span className='underline'>{userEmail}</span> to unlock full access.
                          </p>
                        </>
                      )}
                    </div>
                    <div className='pt-8 border-t border-white/5'>
                      {isPublicDemo ? (
                        <Link
                          href='/register'
                          className='inline-flex items-center justify-center gap-2 w-full py-4 bg-lime-400 text-black font-black uppercase text-[11px] tracking-[0.4em] rounded-[7px] hover:bg-white transition-all'
                        >
                          Register to unlock full access
                        </Link>
                      ) : (
                        <button
                          onClick={() => setActivePage('SUMMARY')}
                          className='text-[10px] text-slate-500 hover:text-white font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-2 mx-auto'
                        >
                          <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path d='M10 19l-7-7m0 0l7-7m-7 7h18' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
                          </svg>
                          Back to Summary
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`flex-1 flex flex-col transition-all duration-1000 ${isRestricted(activePage) ? 'blur-xl pointer-events-none select-none opacity-40 grayscale-[0.8]' : 'opacity-100'}`}
              >
                {activePage === 'COVER' && (
                  <div className='flex-1 flex flex-col justify-center items-center text-center p-20 animate-in fade-in zoom-in-95 duration-1000 relative z-10 h-full min-h-[700px]'>
                    <div className='absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden'>
                      <div className='absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(217,255,0,0.15)_0%,transparent_70%)]'></div>
                      <div
                        className='absolute top-0 left-0 w-full h-full'
                        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                      ></div>
                    </div>

                    <div className='mb-12 md:mb-20 relative'>
                      <span className='text-lime-400 text-xs font-black uppercase tracking-[1em] block mb-8 md:mb-12 animate-in slide-in-from-top-4 duration-700'>Confidential Report</span>
                      <div className='h-0.5 w-32 bg-lime-400 mx-auto mb-10 md:mb-16 shadow-[0_0_20px_rgba(217,255,0,0.8)]'></div>
                      <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tighter text-white mb-6 leading-[0.75] animate-in zoom-in-95 duration-1000'>
                        AIEO <br />
                        <span className='text-slate-800'>AUDIT</span>
                      </h1>
                      <div className='flex items-center justify-center gap-4 md:gap-6 mt-8 md:mt-10'>
                        <div className='h-[1px] w-12 bg-white/10'></div>
                        <p className='text-slate-400 text-xs sm:text-sm font-black uppercase tracking-[0.6em]'>2025 Visibility Intelligence</p>
                        <div className='h-[1px] w-12 bg-white/10'></div>
                      </div>
                    </div>

                    <div className='mt-auto w-full max-w-2xl border-t border-white/5 pt-8 md:pt-12 text-left'>
                      <div className='grid grid-cols-2 gap-6 sm:gap-8 md:gap-16'>
                        <div className='space-y-2 md:space-y-4 min-w-0'>
                          <span className='text-[10px] text-slate-600 font-black uppercase tracking-widest block'>Client Profile</span>
                          <h3 className='text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white uppercase tracking-tight leading-tight break-words'>{formData.brandName}</h3>
                          <div className='flex items-center gap-2'>
                            <span className='w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0'></span>
                            <p className='text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate' title={formData.industry}>{formData.industry}</p>
                          </div>
                        </div>
                        <div className='space-y-2 md:space-y-4 min-w-0'>
                          <span className='text-[10px] text-slate-600 font-black uppercase tracking-widest block'>Generation Date</span>
                          <h3 className='text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white uppercase tracking-tight break-words'>
                            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </h3>
                          <div className='flex items-center gap-2'>
                            <span className='text-[10px] text-lime-400 font-black uppercase tracking-widest'>Powered by GetNifty</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activePage === 'SUMMARY' && (
                  <div className='p-4 md:p-0 animate-in fade-in duration-500 relative z-10 flex flex-col h-full'>
                    <div className='mb-10 md:mb-16'>
                      <span className='text-lime-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block'>Section 01</span>
                      <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-none gradient-text'>
                        Analysis <br />
                        Findings
                      </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-10 md:mb-16 items-start'>
                      <div className='p-6 md:p-10 bg-white/[0.02] border border-white/5 border-l-[12px] border-l-lime-400 rounded-[8px] shadow-2xl relative overflow-visible min-h-[200px] md:min-h-[280px] flex flex-col justify-center h-auto backdrop-blur-md'>
                        <div className='absolute -top-4 -right-4 w-12 h-12 bg-slate-900 border border-white/10 flex items-center justify-center rounded-full text-lime-400 font-black italic'>
                          !
                        </div>
                        <span className='text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-4 md:mb-6'>Executive Context</span>
                        <p className='text-slate-200 text-xs lg:text-sm font-bold tracking-[0.1em] leading-loose italic relative z-10 break-words max-w-full uppercase'>
                          &quot;{result.foundation?.summary || 'Summary generation in progress...'}&quot;
                        </p>
                      </div>
                      <div className='grid grid-cols-2 gap-3 md:gap-4 lg:gap-6'>
                        {[
                          {
                            label: 'Overall Visibility',
                            val: `${result.overallScore}%`,
                            color: result.overallScore < 50 ? 'text-red-500' : 'text-lime-400',
                            desc: 'Weighted Aggregate',
                          },
                          { label: 'Data Integrity', val: `${result.foundation?.entityConfidence || 0}%`, color: 'text-white', desc: 'Trust Consistency' },
                          { label: 'Alignment', val: `${result.logicIntegrity || 0}%`, color: 'text-emerald-400', desc: 'Category Match' },
                          { label: 'Search Index', val: `${result.searchVisibilityIndex || 0}%`, color: 'text-slate-400', desc: 'Traditional SEO' },
                        ].map((stat, i) => (
                          <div key={i} className='p-4 md:p-8 bg-white/[0.03] border border-white/5 rounded-[8px] text-center group hover:border-white/10 transition-all'>
                            <span className='text-[8px] lg:text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2 md:mb-4'>{stat.label}</span>
                            <div className={`text-2xl sm:text-3xl md:text-4xl font-black ${stat.color} mb-2`}>{stat.val}</div>
                            <div className='text-[8px] sm:text-[9px] text-slate-600 font-black uppercase tracking-widest'>{stat.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='mt-auto pt-12 border-t border-white/5'>
                      <h3 className='text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-10'>Entity Verification Sources</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {result.sources?.length ? (
                          result.sources.map((source, i) => (
                            <a
                              key={i}
                              href={source.uri}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='p-6 bg-slate-900/60 border border-white/5 rounded-[8px] hover:border-lime-400/30 transition-all flex items-center gap-6 group'
                            >
                              <div className='w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-[10px] font-black group-hover:text-lime-400'>
                                {i + 1}
                              </div>
                              <div className='flex-1 min-w-0'>
                                <span className='text-[10px] text-white font-black uppercase truncate block mb-1' title={source.title}>{source.title}</span>
                                <span className='text-[8px] text-slate-500 font-bold truncate block tracking-widest' title={source.uri}>{source.uri}</span>
                              </div>
                            </a>
                          ))
                        ) : (
                          <div className='col-span-full p-8 bg-white/[0.01] border border-dashed border-white/10 rounded-[8px] text-center'>
                            <p className='text-[11px] text-slate-600 font-black uppercase tracking-widest italic'>
                              No external citations extracted for this specific entity footprint.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activePage === 'ANALYTICS' && (
                  <div className='p-4 md:p-0 animate-in fade-in duration-500 h-full relative z-10 flex flex-col'>
                    <div className='mb-16'>
                      <span className='text-lime-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block'>Section 02</span>
                      <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none text-white'>
                        Engine <span className='text-slate-800'>Analytics</span>
                      </h2>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-stretch'>
                      <div className='p-10 bg-white/[0.02] border border-white/5 rounded-[12px] shadow-2xl flex flex-col relative overflow-hidden group'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-lime-400/5 blur-[80px] -mr-16 -mt-16 group-hover:bg-lime-400/10 transition-all'></div>
                        <span className='text-[10px] text-slate-500 font-black uppercase tracking-widest mb-10 block'>System Pillars</span>
                        <div className='h-[320px] w-full bg-slate-950/40 rounded-[8px] flex items-center justify-center p-4 border border-white/5'>
                          <ResponsiveContainer width='100%' height='100%'>
                            <RadarChart cx='50%' cy='50%' outerRadius='70%' data={radarData}>
                              <PolarGrid stroke='rgba(255,255,255,0.05)' />
                              <PolarAngleAxis
                                dataKey='subject'
                                tickFormatter={(val) => String(val).split(' ')[0].toUpperCase()}
                                tick={{ fill: '#64748b', fontSize: 8, fontWeight: 900 }}
                              />
                              <Radar name='Brand Strength' dataKey='A' stroke='#d9ff00' strokeWidth={3} fill='#d9ff00' fillOpacity={0.15} isAnimationActive={false} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                        <p className='mt-8 text-[9px] text-slate-600 font-black uppercase tracking-widest text-center leading-relaxed'>
                          Visualizing the balance between technical crawl-ability and semantic authority.
                        </p>
                      </div>

                      <div className='p-10 bg-white/[0.02] border border-white/5 rounded-[12px] shadow-2xl flex flex-col backdrop-blur-sm'>
                        <span className='text-[10px] text-slate-500 font-black uppercase tracking-widest mb-10 block'>Intelligence Context</span>
                        <div className='space-y-10 flex-1 flex flex-col justify-center'>
                          {[
                            {
                              label: 'Hallucination Risk',
                              value: result.hallucinationRisk,
                              color: 'text-amber-500',
                              bar: 'bg-amber-500',
                              icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                            },
                            {
                              label: 'Logic Integrity',
                              value: result.logicIntegrity,
                              color: 'text-emerald-500',
                              bar: 'bg-emerald-500',
                              icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                            },
                            { label: 'Model Alignment', value: result.foundation?.score || 0, color: 'text-white', bar: 'bg-white', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                            {
                              label: 'Extraction Speed',
                              value: result.aiVisibilityIndex || 0,
                              color: 'text-lime-400',
                              bar: 'bg-lime-400',
                              icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                            },
                          ].map((m, i) => (
                            <div key={i} className='relative'>
                              <div className='flex justify-between items-center mb-4'>
                                <div className='flex items-center gap-3'>
                                  <svg className={`w-3.5 h-3.5 ${m.color}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d={m.icon} />
                                  </svg>
                                  <span className='text-[10px] text-slate-400 font-black uppercase tracking-widest'>{m.label}</span>
                                </div>
                                <span className={`text-[12px] font-black ${m.color}`}>{m.value}%</span>
                              </div>
                              <div className='h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5'>
                                <div className={`h-full ${m.bar} shadow-[0_0_15px_rgba(217,255,0,0.3)] transition-all duration-1000`} style={{ width: `${m.value}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className='mb-12'>
                      <span className='text-[10px] text-slate-500 font-black uppercase tracking-widest mb-6 block'>Platform Citations</span>
                      <div className='space-y-4'>
                        {(result.aiBreakdown || []).map((engine, i) => (
                          <div key={i} className='p-6 bg-white/[0.02] border border-white/5 rounded-[12px] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 relative overflow-hidden group hover:border-lime-400/20 transition-all'>
                            <div className='absolute top-0 left-0 w-1 h-full bg-lime-400/40'></div>
                            <div className='flex flex-row items-center gap-4 sm:gap-6 flex-1 min-w-0 pl-2'>
                              <span className='text-sm font-black text-white uppercase tracking-tighter shrink-0'>{engine.name}</span>
                              <span className='text-xl font-black text-lime-400 leading-none shrink-0'>{engine.visibilityScore}%</span>
                              <span className='text-[7px] text-slate-500 font-black uppercase tracking-widest shrink-0'>Visibility</span>
                            </div>
                            <p className='text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed break-words min-w-0 italic flex-1 pl-2'>&quot;{engine.keyTakeaway}&quot;</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activePage === 'DIAGNOSTIC' && (
                  <div className='p-4 md:p-6 lg:p-10 animate-in fade-in duration-500 relative z-10 flex flex-col'>
                    <div className='mb-12'>
                      <span className='text-lime-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block'>Section 03</span>
                      <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none text-white'>
                        22-Point <span className='text-slate-800'>Verification</span>
                      </h2>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 pb-16'>
                      {(result.technicalChecklist || []).map((item, i) => (
                        <div
                          key={i}
                          className={`group p-6 bg-white/[0.01] border border-white/5 rounded-[8px] border-l-4 transition-all hover:bg-white/[0.03] hover:-translate-y-1 ${item.status === 'Pass' ? 'border-l-emerald-500/50 hover:border-l-emerald-400' : item.status === 'Warning' ? 'border-l-amber-500/50 hover:border-l-amber-400' : 'border-l-red-500/50 hover:border-l-red-500'}`}
                        >
                          <div className='flex justify-between items-start gap-4 mb-4'>
                            <div className='flex flex-col'>
                              <span className='text-[8px] text-slate-600 font-black uppercase tracking-[0.3em] mb-1'>P.{String(i + 1).padStart(2, '0')}</span>
                              <span className='text-[11px] text-slate-200 font-black uppercase tracking-widest leading-tight group-hover:text-white transition-colors'>
                                {item.point}
                              </span>
                            </div>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-1 rounded shrink-0 shadow-sm ${item.status === 'Pass' ? 'text-emerald-400 bg-emerald-400/5 border border-emerald-400/20' : item.status === 'Warning' ? 'text-amber-400 bg-amber-400/5 border border-amber-400/20' : 'text-red-500 bg-red-500/5 border border-red-500/20'}`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className='text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed break-words min-w-0'>{item.observation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePage === 'SOCIAL' && (
                  <div className='p-4 md:p-6 lg:p-10 animate-in fade-in duration-500 relative z-10 flex flex-col h-full'>
                    <div className='mb-16'>
                      <span className='text-lime-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block'>Section 04</span>
                      <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-none text-white'>
                        Social <span className='text-slate-800'>Citations</span>
                      </h2>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 pb-16'>
                      {(result.socialFootprint || []).map((platform, i) => (
                        <div
                          key={i}
                          className='p-10 bg-white/[0.02] border border-white/5 rounded-[12px] flex flex-col gap-6 relative group hover:border-white/10 transition-all backdrop-blur-sm'
                        >
                          <div className='flex justify-between items-center gap-6'>
                            <h4 className='text-2xl font-black text-white uppercase tracking-tighter truncate' title={platform.platform}>{platform.platform}</h4>
                            <div className='flex flex-col items-end shrink-0'>
                              <span
                                className={`px-2 py-0.5 text-[8px] font-black uppercase rounded-[4px] mb-1 ${platform.presence === 'High' ? 'bg-lime-400 text-black' : platform.presence === 'Medium' ? 'bg-white/10 text-white' : 'bg-slate-800 text-slate-500'}`}
                              >
                                {platform.presence} Signal
                              </span>
                            </div>
                          </div>
                          <div className='flex items-center gap-4 py-4 border-y border-white/5'>
                            <span className='text-[10px] text-slate-500 font-black uppercase tracking-widest shrink-0'>Analysis:</span>
                            <span
                              className={`text-[11px] font-black uppercase truncate ${platform.sentiment.toLowerCase().includes('positive') ? 'text-emerald-400' : platform.sentiment.toLowerCase().includes('negative') ? 'text-red-400' : 'text-white'}`}
                              title={platform.sentiment}
                            >
                              {platform.sentiment}
                            </span>
                          </div>
                          <p className='text-slate-400 text-[12px] font-bold uppercase tracking-widest leading-relaxed break-words min-w-0'>{platform.observation}</p>
                          <div className='absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none text-5xl font-black uppercase italic select-none'>
                            {platform.platform.substring(0, 1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePage === 'PILLARS' && (
                  <div className='p-4 md:p-6 lg:p-10 animate-in fade-in duration-500 relative z-10 flex flex-col'>
                    <div className='mb-16'>
                      <span className='text-lime-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block'>Section 05</span>
                      <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none text-white'>
                        Optimization <span className='text-slate-800'>Layers</span>
                      </h2>
                    </div>

                    <div className='space-y-8 pb-16'>
                      {(result.pillarAnalysis || []).map((pillar, i) => (
                        <div
                          key={i}
                          className='p-10 bg-white/[0.02] border border-white/5 rounded-[12px] flex flex-col md:flex-row gap-12 items-center group hover:bg-white/[0.04] transition-all'
                        >
                          <div className='w-20 h-20 bg-slate-900 border-2 border-white/10 flex items-center justify-center font-black text-3xl text-lime-400 rounded-[12px] shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.3)]'>
                            0{i + 1}
                          </div>
                          <div className='flex-1'>
                            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-6 gap-4'>
                              <h4 className='text-3xl font-black text-white uppercase tracking-tighter group-hover:text-lime-400 transition-colors'>{pillar.title}</h4>
                              <div className='flex flex-col sm:items-end'>
                                <span className='text-[12px] font-black text-lime-400 uppercase tracking-[0.2em]'>{pillar.score}% Efficiency</span>
                                <div className='h-1 w-32 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5'>
                                  <div className='h-full bg-lime-400' style={{ width: `${pillar.score}%` }} />
                                </div>
                              </div>
                            </div>
                            <p className='text-slate-400 text-sm font-bold uppercase tracking-widest leading-loose italic border-l-4 border-lime-400/20 pl-8 py-2'>
                              {pillar.evaluation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePage === 'ROADMAP' && (
                  <div className='p-4 md:p-6 lg:p-10 animate-in fade-in duration-500 relative z-10 flex flex-col'>
                    <div className='mb-16'>
                      <span className='text-lime-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block'>Section 06</span>
                      <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none text-white'>
                        Strategic <span className='text-slate-800'>Roadmap</span>
                      </h2>
                    </div>

                    <div className='grid grid-cols-1 gap-10 pb-16'>
                      {(result.globalRecommendations || []).map((rec, i) => (
                        <div
                          key={i}
                          className='p-12 bg-slate-900/60 border border-white/10 rounded-[12px] relative overflow-hidden group hover:border-lime-400/30 transition-all backdrop-blur-xl'
                        >
                          <div className='absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-lime-400/5 to-transparent pointer-events-none'></div>
                          <div className='flex flex-wrap items-center gap-6 mb-8 relative z-10'>
                            <div
                              className={`px-6 py-2 text-[10px] font-black uppercase rounded-[6px] shadow-lg ${rec.priority.toLowerCase() === 'high' ? 'bg-red-600 text-white' : 'bg-lime-400 text-black'}`}
                            >
                              {rec.priority} Priority Action
                            </div>
                            <div className='flex items-center gap-2'>
                              <svg className='w-4 h-4 text-slate-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                              </svg>
                              <span className='text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]'>Target Implementation: {rec.timeline}</span>
                            </div>
                          </div>
                          <h4 className='text-4xl font-black text-white uppercase tracking-tighter mb-6 relative z-10 leading-none'>{rec.title}</h4>
                          <p className='text-slate-400 text-base font-bold uppercase tracking-widest leading-relaxed max-w-3xl relative z-10 italic'>{rec.action}</p>
                          <div className='absolute -bottom-8 -right-8 text-9xl font-black text-white/[0.02] italic pointer-events-none group-hover:text-white/[0.04] transition-all'>
                            0{i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditTool
