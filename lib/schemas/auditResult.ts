import { z } from 'zod';

const sectionStatusSchema = z
  .string()
  .transform((s) => {
    const v = s?.trim?.() ?? '';
    if (/optimal|excellent|strong|good/i.test(v)) return 'Optimal';
    if (/critical|poor|weak|bad/i.test(v)) return 'Critical';
    return 'Average';
  })
  .pipe(z.enum(['Critical', 'Optimal', 'Average']));

const checklistStatusSchema = z
  .string()
  .transform((s) => {
    const v = (s?.trim?.() ?? '').toLowerCase();
    if (v === 'pass' || /optimal|excellent|good|strong|yes/i.test(v)) return 'Pass';
    if (v === 'fail' || /critical|poor|bad|no/i.test(v)) return 'Fail';
    return 'Warning';
  })
  .pipe(z.enum(['Pass', 'Fail', 'Warning']));

const presenceSchema = z
  .string()
  .transform((s) => {
    const v = (s?.trim?.() ?? '').toLowerCase();
    if (/high|strong|active/i.test(v)) return 'High';
    if (/none|absent|n\/a/i.test(v)) return 'None';
    if (/low|minimal|weak/i.test(v)) return 'Low';
    return 'Medium';
  })
  .pipe(z.enum(['High', 'Medium', 'Low', 'None']));

const threatLevelSchema = z
  .string()
  .transform((s) => {
    const v = (s?.trim?.() ?? '').toLowerCase();
    if (/high|critical|severe/i.test(v)) return 'High';
    if (/low|minimal/i.test(v)) return 'Low';
    return 'Medium';
  })
  .pipe(z.enum(['Low', 'Medium', 'High']));

const prioritySchema = z
  .string()
  .transform((s) => {
    const v = (s?.trim?.() ?? '').toLowerCase();
    if (/high|critical|urgent/i.test(v)) return 'High';
    if (/low|minor/i.test(v)) return 'Low';
    return 'Medium';
  })
  .pipe(z.enum(['High', 'Medium', 'Low']));

const knowledgeGraphSchema = z
  .string()
  .transform((s) => {
    const v = (s?.trim?.() ?? '').toLowerCase();
    if (/yes|full|complete|true/i.test(v)) return 'Yes';
    if (/no|none|false/i.test(v)) return 'No';
    return 'Partial';
  })
  .pipe(z.enum(['Yes', 'Partial', 'No']));

const sectionScoreSchema = z.object({
  score: z.coerce.number(),
  status: sectionStatusSchema,
  summary: z.string(),
});

const engineMetricsSchema = z.object({
  name: z.string(),
  visibilityScore: z.coerce.number(),
  recommendationLikelihood: z.coerce.number(),
  brandAuthority: z.coerce.number(),
  citationCount: z.coerce.number(),
  sentiment: z.string(),
  keyTakeaway: z.string(),
});

const competitorDataSchema = z.object({
  name: z.string(),
  visibilityScore: z.coerce.number(),
  primaryStrength: z.string(),
  threatLevel: threatLevelSchema,
});

const pillarDetailSchema = z.object({
  title: z.string(),
  evaluation: z.string(),
  score: z.coerce.number(),
});

const technicalCheckPointSchema = z.object({
  point: z.string(),
  status: checklistStatusSchema,
  observation: z.string(),
});

const socialPlatformSchema = z.object({
  platform: z.string(),
  presence: presenceSchema,
  sentiment: z.string(),
  observation: z.string(),
});

const traditionalRankingSchema = z.object({
  engine: z.string(),
  rank: z.string(),
  status: sectionStatusSchema,
});

const globalRecommendationSchema = z.object({
  title: z.string(),
  action: z.string(),
  priority: prioritySchema,
  timeline: z.string(),
});

const sourceSchema = z.object({
  title: z.string(),
  uri: z.string(),
});

const foundationSchema = sectionScoreSchema.extend({
  entityConfidence: z.coerce.number(),
  napConsistency: z.string(),
  schemaValidation: z.string(),
  knowledgeGraph: knowledgeGraphSchema,
});

const technicalSchema = sectionScoreSchema.extend({
  coreWebVitals: z.string(),
  pageSpeed: z.coerce.number(),
  mobileHealth: z.string(),
});

const authoritySchema = sectionScoreSchema.extend({
  referringDomains: z.coerce.number(),
  sentimentScore: z.coerce.number(),
  trustSignals: z.array(z.string()),
});

export const auditResultSchema = z.object({
  overallScore: z.coerce.number(),
  searchVisibilityIndex: z.coerce.number(),
  aiVisibilityIndex: z.coerce.number(),
  hallucinationRisk: z.coerce.number(),
  logicIntegrity: z.coerce.number(),
  foundation: foundationSchema,
  technical: technicalSchema,
  authority: authoritySchema,
  aiBreakdown: z.array(engineMetricsSchema),
  pillarAnalysis: z.array(pillarDetailSchema),
  technicalChecklist: z.array(technicalCheckPointSchema),
  socialFootprint: z.array(socialPlatformSchema),
  traditionalRankings: z.array(traditionalRankingSchema).optional().default([]),
  competitors: z.array(competitorDataSchema).optional().default([]),
  globalRecommendations: z.array(globalRecommendationSchema),
  sources: z.array(sourceSchema).optional().default([]),
});

export type AuditResult = z.infer<typeof auditResultSchema>;

export function parseAuditResult(
  data: unknown,
  sources: { title: string; uri: string }[] = []
): AuditResult {
  const parsed = auditResultSchema.safeParse(data);
  if (!parsed.success) {
    const msg = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw new Error(`Audit response validation failed: ${msg}`);
  }
  return { ...parsed.data, sources };
}
