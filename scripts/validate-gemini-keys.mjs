#!/usr/bin/env node
/**
 * Validates GEMINI_API_KEY(s) in .env.local and keeps the first working one.
 * Does not log or expose key values. Usage: node scripts/validate-gemini-keys.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GoogleGenAI } from '@google/genai';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
/** Try in order; @google/genai quick start uses gemini-2.5-flash. */
const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];

function extractKeys(content) {
  const keys = [];
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*GEMINI_API_KEY(?:_BACKUP)?\s*=\s*(.+)$/);
    if (m && !line.trimStart().startsWith('#')) {
      const val = m[1].trim().replace(/^["']|["']$/g, '');
      if (val) keys.push({ raw: m[1].trim(), key: val });
    }
  }
  return { keys, lines };
}

function getErrorCode(err) {
  const msg = String(err?.message ?? err);
  if (msg.includes('404') || msg.includes('NOT_FOUND')) return '404';
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) return '429';
  if (msg.includes('403') || msg.includes('PERMISSION_DENIED')) return '403';
  if (msg.includes('401') || msg.includes('UNAUTHENTICATED')) return '401';
  return 'error';
}

async function testKey(apiKey) {
  const ai = new GoogleGenAI({ apiKey });
  let lastCode = '404_or_error';
  let lastModel = null;
  for (const model of MODELS_TO_TRY) {
    try {
      await ai.models.generateContent({
        model,
        contents: 'Reply with exactly: OK',
      });
      return { ok: true, model };
    } catch (e) {
      const code = getErrorCode(e);
      lastCode = code;
      lastModel = model;
      if (code === '401' || code === '403') return { ok: false, model, code };
      if (code === '429') return { ok: false, model, code };
    }
  }
  return { ok: false, model: lastModel, code: lastCode };
}

async function main() {
  let content;
  try {
    content = readFileSync(envPath, 'utf8');
  } catch (e) {
    console.error('.env.local not found or unreadable.');
    process.exit(1);
  }

  const { keys, lines } = extractKeys(content);
  if (keys.length === 0) {
    console.error('No GEMINI_API_KEY= line found in .env.local');
    process.exit(1);
  }

  for (let i = 0; i < keys.length; i++) {
    const result = await testKey(keys[i].key);
    if (result.ok) {
      const newLines = lines.filter((l) => !/^\s*GEMINI_API_KEY(?:_BACKUP)?\s*=/.test(l));
      newLines.push(`GEMINI_API_KEY=${keys[i].raw}`);
      writeFileSync(envPath, newLines.join('\n') + '\n', 'utf8');
      console.log(`Validated: using key ${i + 1} of ${keys.length} with model ${result.model}. .env.local updated.`);
      process.exit(0);
    }
    console.error(`Key ${i + 1}: ${result.code}${result.model ? ` (tried ${result.model})` : ''}.`);
  }

  console.error(`Neither of the ${keys.length} API key(s) worked. Tried models: ${MODELS_TO_TRY.join(', ')}.`);
  process.exit(1);
}

main().catch((err) => {
  console.error(err?.message ?? err);
  process.exit(1);
});
