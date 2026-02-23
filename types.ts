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

/** Re-exported from Zod schema (single source of truth for audit response shape). */
export type { AuditResult } from './lib/schemas/auditResult';

export enum SectionId {
  Hero = 'hero',
  Synergy = 'synergy',
  Audit = 'audit',
  Problem = 'problem',
  Solution = 'solution',
  FAQ = 'faq',
  Contact = 'contact'
}
