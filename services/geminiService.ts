
import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult } from "../types";

export interface AuditInputs {
  brandName: string;
  industry: string;
  websiteUrl: string;
  keywords: string;
  location: string;
  serviceCategories: string;
}

export class GeminiService {
  constructor() {}

  private extractJson(text: string): any {
    if (!text) {
      throw new Error("Received empty response from the AI engine.");
    }

    const cleaned = text.trim();
    
    // Attempt 1: Direct parse
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      // Attempt 2: Extract from markdown block
      const markdownMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (markdownMatch && markdownMatch[1]) {
        try {
          return JSON.parse(markdownMatch[1].trim());
        } catch (innerE) {
          // Fall through
        }
      }

      // Attempt 3: Find first '{' and last '}' to handle conversational prefixes/suffixes
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const potentialJson = cleaned.substring(firstBrace, lastBrace + 1);
        try {
          return JSON.parse(potentialJson);
        } catch (innerE) {
          // Fall through
        }
      }
      
      console.error("Failed to parse JSON. Raw response preview:", text.substring(0, 200));
      throw new Error("The report data is formatted incorrectly. Please try again.");
    }
  }

  async analyzeBrand(inputs: AuditInputs): Promise<AuditResult> {
    const { brandName, industry, websiteUrl, keywords, location, serviceCategories } = inputs;
    
    const prompt = `Perform a high-precision digital visibility and AIEO (Artificial Intelligence Engine Optimization) audit for "${brandName}". 
    
    AIEO FRAMEWORK CONTEXT:
    1. Crawl Layer (SEO Foundation): Indexable architecture, schema, speed.
    2. Answer Layer (AEO Structure): Q&A formatting, entity definitions, extractable data.
    3. AI Knowledge Layer (AIO Signals): Topical authority, brand mentions, E-E-A-T.

    CRITICAL REQUIREMENTS:
    - Return a single, valid JSON object following the requested schema.
    - Provide a professional executive analysis in 'foundation.summary' focusing on why AI engines might or might not prioritize this brand.
    - Engine Breakdown: Exactly 3 platforms (ChatGPT, Gemini, Perplexity).
    - Technical Checklist: Provide a list of exactly 22 technical checkpoints.
    - Visibility Factors (pillarAnalysis): 5 items (Crawl, Answer, AI Knowledge, Brand Authority, Trust).
    - Social Footprint: Analyze brand presence across 6 major platforms.
    - Action Plan: 3 prioritized recommendations.

    ENTITY: ${brandName} (${websiteUrl}), ${industry} in ${location}.
    KEYWORDS: ${keywords}.
    SERVICES: ${serviceCategories}.`;

    // Initialize fresh to ensure latest API key is used from environment
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "overallScore", 
            "searchVisibilityIndex", 
            "aiVisibilityIndex", 
            "hallucinationRisk",
            "logicIntegrity",
            "aiBreakdown", 
            "technicalChecklist", 
            "pillarAnalysis", 
            "globalRecommendations", 
            "socialFootprint", 
            "foundation", 
            "technical", 
            "authority"
          ],
          properties: {
            overallScore: { type: Type.NUMBER },
            searchVisibilityIndex: { type: Type.NUMBER },
            aiVisibilityIndex: { type: Type.NUMBER },
            hallucinationRisk: { type: Type.NUMBER },
            logicIntegrity: { type: Type.NUMBER },
            foundation: {
              type: Type.OBJECT,
              required: ["score", "status", "summary", "entityConfidence", "napConsistency", "schemaValidation", "knowledgeGraph"],
              properties: {
                score: { type: Type.NUMBER },
                status: { type: Type.STRING },
                summary: { type: Type.STRING },
                entityConfidence: { type: Type.NUMBER },
                napConsistency: { type: Type.STRING },
                schemaValidation: { type: Type.STRING },
                knowledgeGraph: { type: Type.STRING, enum: ["Yes", "Partial", "No"] }
              }
            },
            technical: {
              type: Type.OBJECT,
              required: ["score", "status", "summary", "coreWebVitals", "pageSpeed", "mobileHealth"],
              properties: {
                score: { type: Type.NUMBER },
                status: { type: Type.STRING },
                summary: { type: Type.STRING },
                coreWebVitals: { type: Type.STRING },
                pageSpeed: { type: Type.NUMBER },
                mobileHealth: { type: Type.STRING }
              }
            },
            pillarAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "evaluation", "score"],
                properties: {
                  title: { type: Type.STRING },
                  evaluation: { type: Type.STRING },
                  score: { type: Type.NUMBER }
                }
              }
            },
            technicalChecklist: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["point", "status", "observation"],
                properties: {
                  point: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["Pass", "Fail", "Warning"] },
                  observation: { type: Type.STRING }
                }
              }
            },
            socialFootprint: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["platform", "presence", "sentiment", "observation"],
                properties: {
                  platform: { type: Type.STRING },
                  presence: { type: Type.STRING, enum: ["High", "Medium", "Low", "None"] },
                  sentiment: { type: Type.STRING },
                  observation: { type: Type.STRING }
                }
              }
            },
            aiBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "visibilityScore", "recommendationLikelihood", "brandAuthority", "citationCount", "sentiment", "keyTakeaway"],
                properties: {
                  name: { type: Type.STRING },
                  visibilityScore: { type: Type.NUMBER },
                  recommendationLikelihood: { type: Type.NUMBER },
                  brandAuthority: { type: Type.NUMBER },
                  citationCount: { type: Type.NUMBER },
                  sentiment: { type: Type.STRING },
                  keyTakeaway: { type: Type.STRING }
                }
              }
            },
            authority: {
              type: Type.OBJECT,
              required: ["score", "status", "summary", "referringDomains", "sentimentScore", "trustSignals"],
              properties: {
                score: { type: Type.NUMBER },
                status: { type: Type.STRING },
                summary: { type: Type.STRING },
                referringDomains: { type: Type.NUMBER },
                sentimentScore: { type: Type.NUMBER },
                trustSignals: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            globalRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "action", "priority", "timeline"],
                properties: {
                  title: { type: Type.STRING },
                  action: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  timeline: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const data = this.extractJson(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      })) || [];

    return { ...data, sources };
  }
}

export const geminiService = new GeminiService();
