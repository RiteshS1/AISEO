
export interface SectionScore {
  score: number;
  status: 'Critical' | 'Optimal' | 'Average';
  summary: string;
}

export interface EngineMetrics {
  name: string;
  visibilityScore: number;
  recommendationLikelihood: number;
  brandAuthority: number;
  citationCount: number;
  sentiment: string;
  keyTakeaway: string;
}

export interface CompetitorData {
  name: string;
  visibilityScore: number;
  primaryStrength: string;
  threatLevel: 'Low' | 'Medium' | 'High';
}

export interface PillarDetail {
  title: string;
  evaluation: string;
  score: number;
}

export interface TechnicalCheckPoint {
  point: string;
  status: 'Pass' | 'Fail' | 'Warning';
  observation: string;
}

export interface SocialPlatform {
  platform: string;
  presence: 'High' | 'Medium' | 'Low' | 'None';
  sentiment: string;
  observation: string;
}

export interface AuditResult {
  overallScore: number;
  searchVisibilityIndex: number;
  aiVisibilityIndex: number;
  hallucinationRisk: number; // 0-100 scale of how likely the AI is guessing/hallucinating
  logicIntegrity: number; // 0-100 scale of brand/industry/service alignment
  
  // Foundation & Technical
  foundation: SectionScore & {
    entityConfidence: number;
    napConsistency: string;
    schemaValidation: string;
    knowledgeGraph: 'Yes' | 'Partial' | 'No';
  };

  technical: SectionScore & {
    coreWebVitals: string;
    pageSpeed: number;
    mobileHealth: string;
  };

  // Analysis Arrays
  aiBreakdown: EngineMetrics[];
  pillarAnalysis: PillarDetail[];
  technicalChecklist: TechnicalCheckPoint[];
  socialFootprint: SocialPlatform[];

  // Reputation & Competitors
  authority: SectionScore & {
    referringDomains: number;
    sentimentScore: number;
    trustSignals: string[];
  };

  traditionalRankings: {
    engine: string;
    rank: string;
    status: 'Critical' | 'Optimal' | 'Average';
  }[];

  competitors: CompetitorData[];
  globalRecommendations: {
    title: string;
    action: string;
    priority: 'High' | 'Medium' | 'Low';
    timeline: string;
  }[];

  sources: { title: string; uri: string }[];
}

export interface MailerLiteSubscriber {
  email: string;
  brandName: string;
  industry: string;
  websiteUrl: string;
  keywords: string;
  reportUrl?: string;
}

export enum SectionId {
  Hero = 'hero',
  Synergy = 'synergy',
  Audit = 'audit',
  Problem = 'problem',
  Solution = 'solution',
  FAQ = 'faq',
  Contact = 'contact'
}
