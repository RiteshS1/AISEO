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

const PRIMARY_MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.1-flash-lite';
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL ?? 'gemini-3.5-flash';
const GROQ_MODEL = process.env.GROQ_MODEL ?? 'openai/gpt-oss-120b';

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

async function runAuditWithModel(
  inputs: AuditInputs,
  modelName: string,
  provider: 'gemini' | 'groq' = 'gemini'
): Promise<AuditResult> {
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

  if (provider === 'groq') {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured.');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert AI SEO auditor. Return only valid JSON matching the requested schema. Do not include markdown or commentary.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorText = (await response.text()).slice(0, 1000);
      throw new Error(`Groq API error (${response.status}): ${errorText}`);
    }

    const responseData = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const text = responseData.choices?.[0]?.message?.content ?? '';
    return parseAuditResult(extractJson(text), []);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

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
  const errors: string[] = [];
  try {
    return await runAuditWithModel(inputs, PRIMARY_MODEL);
  } catch (primaryError) {
    errors.push(`Gemini ${PRIMARY_MODEL}: ${getErrorMessage(primaryError)}`);
    if (shouldFallbackToSecondary(primaryError)) {
      console.warn(`Primary model ${PRIMARY_MODEL} failed. Falling back to ${FALLBACK_MODEL}.`);
      try {
        return await runAuditWithModel(inputs, FALLBACK_MODEL);
      } catch (secondaryError) {
        errors.push(`Gemini ${FALLBACK_MODEL}: ${getErrorMessage(secondaryError)}`);
      }
    }

    console.warn(`Gemini providers failed. Falling back to Groq ${GROQ_MODEL}.`);
    try {
      return await runAuditWithModel(inputs, GROQ_MODEL, 'groq');
    } catch (groqError) {
      errors.push(`Groq ${GROQ_MODEL}: ${getErrorMessage(groqError)}`);
      throw new Error(`All AI providers failed. ${errors.join(' | ')}`);
    }
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
