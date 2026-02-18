import { GoogleGenAI } from '@google/genai';
import type { AuditResult } from '@/lib/schemas/auditResult';
import { parseAuditResult } from '@/lib/schemas/auditResult';
import type { AuditInputs } from '@/lib/schemas/auditInputs';

function extractJson(text: string): unknown {
  if (!text?.trim()) {
    throw new Error('Received empty response from the AI engine.');
  }
  const cleaned = text.trim();
  try {
    return JSON.parse(cleaned) as unknown;
  } catch {
    const markdownMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch?.[1]) {
      try {
        return JSON.parse(markdownMatch[1].trim()) as unknown;
      } catch {
        // fall through
      }
    }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1)) as unknown;
      } catch {
        // fall through
      }
    }
  }
  throw new Error('The report data is formatted incorrectly. Please try again.');
}

const PRIMARY_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL ?? 'gemini-1.5-flash';

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 2000;

function isRateLimitError(e: unknown): boolean {
  const msg = String(e instanceof Error ? e.message : e);
  return msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('exhausted') || msg.includes('rate limit');
}

function shouldFallbackToSecondary(e: unknown): boolean {
  const msg = String(e instanceof Error ? e.message : e);
  return msg.includes('429') || msg.includes('503') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('SERVICE_UNAVAILABLE') || msg.includes('rate limit');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAuditWithModel(inputs: AuditInputs, modelName: string): Promise<AuditResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const { brandName, industry, websiteUrl, keywords, location, serviceCategories } = inputs;
  const prompt = `Perform a high-precision digital visibility and AIEO (Artificial Intelligence Engine Optimization) audit for "${brandName}". 
    
    AIEO FRAMEWORK CONTEXT:
    1. Crawl Layer (SEO Foundation): Indexable architecture, schema, speed.
    2. Answer Layer (AEO Structure): Q&A formatting, entity definitions, extractable data.
    3. AI Knowledge Layer (AIO Signals): Topical authority, brand mentions, E-E-A-T.

    CRITICAL REQUIREMENTS:
    - You must return ONLY raw, valid JSON matching the requested schema. Do not include markdown formatting like \`\`\`json. Ensure all quotes are escaped properly.
    - Return a single, valid JSON object following the requested schema.
    - Provide a professional executive analysis in 'foundation.summary' focusing on why AI engines might or might not prioritize this brand.
    - Engine Breakdown: Exactly 3 platforms (ChatGPT, Gemini, Perplexity).
    - Technical Checklist: Provide a list of exactly 22 technical checkpoints.
    - Visibility Factors (pillarAnalysis): 5 items (Crawl, Answer, AI Knowledge, Brand Authority, Trust).
    - Social Footprint: Analyze brand presence across 6 major platforms.
    - Action Plan: 3 prioritized recommendations.

    ENTITY: ${brandName} (${websiteUrl}), ${industry} in ${location}.
    KEYWORDS: ${keywords}.
    SERVICES: ${serviceCategories}.

CRITICAL INSTRUCTION: You MUST return a raw JSON object. Do not wrap it in markdown. The JSON MUST strictly adhere to this exact TypeScript structure. Do not omit any keys.

{
  "overallScore": number (0-100),
  "searchVisibilityIndex": number (0-100),
  "aiVisibilityIndex": number (0-100),
  "hallucinationRisk": number (0-100),
  "logicIntegrity": number (0-100),
  "foundation": {
    "score": number,
    "status": "Critical" | "Optimal" | "Average",
    "summary": string,
    "entityConfidence": number,
    "napConsistency": string,
    "schemaValidation": string,
    "knowledgeGraph": "Yes" | "Partial" | "No"
  },
  "technical": {
    "score": number,
    "status": "Critical" | "Optimal" | "Average",
    "summary": string,
    "coreWebVitals": string,
    "pageSpeed": number,
    "mobileHealth": string
  },
  "aiBreakdown": [
    {
      "name": string,
      "visibilityScore": number,
      "recommendationLikelihood": number,
      "brandAuthority": number,
      "citationCount": number,
      "sentiment": string,
      "keyTakeaway": string
    }
  ],
  "pillarAnalysis": [
    {
      "title": string,
      "evaluation": string,
      "score": number
    }
  ],
  "technicalChecklist": [
    {
      "point": string,
      "status": "Pass" | "Fail" | "Warning" (ONLY use these 3 exact strings),
      "observation": string
    }
  ],
  "socialFootprint": [
    {
      "platform": string,
      "presence": "High" | "Medium" | "Low" | "None" (ONLY use these 4 exact strings),
      "sentiment": string,
      "observation": string
    }
  ],
  "authority": {
    "score": number,
    "status": "Critical" | "Optimal" | "Average",
    "summary": string,
    "referringDomains": number,
    "sentimentScore": number,
    "trustSignals": array of strings
  },
  "traditionalRankings": [
    {
      "engine": string,
      "rank": string,
      "status": "Critical" | "Optimal" | "Average"
    }
  ],
  "competitors": [
    {
      "name": string,
      "visibilityScore": number,
      "primaryStrength": string,
      "threatLevel": "Low" | "Medium" | "High"
    }
  ],
  "globalRecommendations": [
    {
      "title": string,
      "action": string,
      "priority": "High" | "Medium" | "Low",
      "timeline": string
    }
  ]
}`;

  const ai = new GoogleGenAI({ apiKey });
  const requestConfig = {
    model: modelName,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  };

  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent(requestConfig);
      const text = response.text ?? '';
      const data = extractJson(text);
      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      const sources: { title: string; uri: string }[] = rawChunks
        .filter((c): c is { web: { title?: string; uri?: string } } => Boolean((c as { web?: unknown }).web))
        .map((c) => ({ title: c.web.title ?? '', uri: c.web.uri ?? '' }));
      return parseAuditResult(data, sources);
    } catch (e) {
      lastError = e;
      if (attempt < MAX_RETRIES - 1 && isRateLimitError(e)) {
        const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
        console.warn(`Gemini rate limit (429), retrying in ${backoffMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await sleep(backoffMs);
      } else {
        throw e;
      }
    }
  }
  throw lastError;
}

export async function runAudit(inputs: AuditInputs): Promise<AuditResult> {
  try {
    return await runAuditWithModel(inputs, PRIMARY_MODEL);
  } catch (primaryError) {
    if (shouldFallbackToSecondary(primaryError)) {
      console.warn(`Primary model ${PRIMARY_MODEL} failed. Falling back to ${FALLBACK_MODEL}.`);
      return await runAuditWithModel(inputs, FALLBACK_MODEL);
    }
    throw primaryError;
  }
}
