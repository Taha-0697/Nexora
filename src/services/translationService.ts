/**
 * Bidirectional Translation Service (English <-> Arabic)
 * Provides automatic translation for enterprise content, reviews, and case studies
 * with persistent in-memory + localStorage caching and strict preservation of
 * brand/product names and tech stack terminology.
 */

export interface TranslationResult {
  text: string;
  sourceLang: 'en' | 'ar';
  targetLang: 'en' | 'ar';
  success: boolean;
  error?: string;
}

const AR_CACHE_STORAGE_KEY = 'nexora_ar_translation_cache_v2';
const memoryArCache = new Map<string, string>();
const inflightRequests = new Map<string, Promise<string>>();

// Core tech stack & industry terms that must remain in original English spelling
const PROTECTED_TECH_TERMS: string[] = [
  '.NET Core Web API',
  '.NET Core',
  'ASP.NET Core',
  'ASP.NET',
  '.NET',
  'Next.js',
  'React Native',
  'React.js',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Express.js',
  'NestJS',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'FastAPI',
  'Django',
  'Python',
  'Spring Boot',
  'SQL Server',
  'MSSQL',
  'PostgreSQL',
  'Postgres',
  'MongoDB',
  'MySQL',
  'Redis',
  'Elasticsearch',
  'Prisma',
  'Supabase',
  'Neon',
  'Swift',
  'Kotlin',
  'Flutter',
  'Dart',
  'iOS',
  'Android',
  'Odoo',
  'ZATCA',
  'Kubernetes',
  'Docker',
  'Terraform',
  'Google Cloud',
  'AWS',
  'Azure',
  'GCP',
  'CI/CD',
  'DevOps',
  'REST APIs',
  'REST API',
  'GraphQL',
  'WebSockets',
  'gRPC',
  'OpenAI',
  'Claude',
  'Gemini',
  'LangChain',
  'LLMs',
  'LLM',
  'SaaS',
  'ERP',
  'CRM',
  'POS',
  'TMS',
  'WMS',
  'MES',
  'EHR',
  'B2B',
  'API',
  'SOC2',
  'GDPR',
  'Nexora Systems',
  'Nexora',
];

// Hydrate memory cache from localStorage once on load
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const raw = window.localStorage.getItem(AR_CACHE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.entries(parsed).forEach(([k, v]) => {
          if (typeof v === 'string') {
            memoryArCache.set(k, v);
          }
        });
      }
    }
  } catch {
    // Ignore storage errors
  }
}

function persistArCache() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const obj: Record<string, string> = {};
    const entries = Array.from(memoryArCache.entries()).slice(-600);
    for (const [k, v] of entries) {
      obj[k] = v;
    }
    window.localStorage.setItem(AR_CACHE_STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // Ignore quota errors
  }
}

export function hasArabicCharacters(text?: string | null): boolean {
  if (!text) return false;
  return /[\u0600-\u06FF]/.test(text);
}

function buildCacheKey(cleanText: string, extraProtectedTerms: string[] = []): string {
  if (!extraProtectedTerms || extraProtectedTerms.length === 0) return cleanText;
  const suffix = extraProtectedTerms
    .map(t => t.trim())
    .filter(Boolean)
    .sort()
    .join('|');
  return suffix ? `${cleanText}::${suffix}` : cleanText;
}

export function getCachedArabicTranslation(
  sourceText?: string | null,
  extraProtectedTerms: string[] = []
): string | null {
  if (!sourceText) return null;
  const clean = sourceText.trim();
  if (!clean) return null;
  if (hasArabicCharacters(clean)) return clean;
  return memoryArCache.get(buildCacheKey(clean, extraProtectedTerms)) || null;
}

/**
 * Masks protected product/brand/tech-stack terms before translation,
 * then restores them verbatim after translation.
 */
function maskProtectedTerms(
  text: string,
  extraProtectedTerms: string[] = []
): { masked: string; tokens: string[] } {
  const combined = Array.from(
    new Set([
      ...extraProtectedTerms.map(t => t.trim()).filter(t => t.length >= 2),
      ...PROTECTED_TECH_TERMS,
    ])
  ).sort((a, b) => b.length - a.length); // longest match first

  const tokens: string[] = [];
  let masked = text;

  for (const term of combined) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match whole word/token boundaries where alphanumeric, or exact match for symbols like .NET
    const startsWithWord = /^[A-Za-z0-9]/.test(term);
    const endsWithWord = /[A-Za-z0-9]$/.test(term);
    const pattern = `${startsWithWord ? '\\b' : ''}${escaped}${endsWithWord ? '\\b' : ''}`;
    const regex = new RegExp(pattern, 'gi');

    masked = masked.replace(regex, (matched) => {
      const idx = tokens.length;
      tokens.push(matched);
      return `[[${idx}]]`;
    });
  }

  return { masked, tokens };
}

function unmaskProtectedTerms(translated: string, tokens: string[]): string {
  if (tokens.length === 0) return translated;
  return translated.replace(/\[\[\s*(\d+)\s*\]\]/g, (full, idxStr) => {
    const idx = Number(idxStr);
    return idx >= 0 && idx < tokens.length ? tokens[idx] : full;
  });
}

/**
 * Translates text bidirectionally between English and Arabic.
 * Employs a primary fast neural endpoint with MyMemory fallback.
 */
export async function translateReviewText(
  text: string,
  fromLang: 'en' | 'ar',
  toLang: 'en' | 'ar'
): Promise<string> {
  const clean = text.trim();
  if (!clean) return '';
  if (fromLang === toLang) return clean;

  // 1. Primary Engine: Google Translate neural endpoint (gtx)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(clean)}`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translatedParts = data[0]
          .map((part: any) => (Array.isArray(part) && typeof part[0] === 'string' ? part[0] : ''))
          .join('');
        if (translatedParts.trim()) {
          return translatedParts.trim();
        }
      }
    }
  } catch (err: any) {
    console.warn('[Translation] Primary engine unavailable, attempting fallback:', err.message);
  }

  // 2. Secondary Fallback Engine: MyMemory API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const pair = `${fromLang}|${toLang}`;
    const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${pair}`;
    const res = await fetch(fallbackUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      if (json.responseData && json.responseData.translatedText) {
        return json.responseData.translatedText.trim();
      }
    }
  } catch (err: any) {
    console.error('[Translation] Fallback engine error:', err.message);
  }

  // If both engines fail, return original without crashing
  return clean;
}

/**
 * Translates English text to Arabic while preserving product/brand names
 * and tech stack terms verbatim, with persistent caching & deduplication.
 */
export async function translateToArabicCached(
  sourceText: string,
  extraProtectedTerms: string[] = []
): Promise<string> {
  const clean = (sourceText || '').trim();
  if (!clean) return '';
  if (hasArabicCharacters(clean)) return clean;

  const cacheKey = buildCacheKey(clean, extraProtectedTerms);
  const cached = memoryArCache.get(cacheKey);
  if (cached) return cached;

  const existingPromise = inflightRequests.get(cacheKey);
  if (existingPromise) return existingPromise;

  const { masked, tokens } = maskProtectedTerms(clean, extraProtectedTerms);

  const promise = translateReviewText(masked, 'en', 'ar')
    .then(translatedMasked => {
      const restored = unmaskProtectedTerms(translatedMasked || masked, tokens);
      if (restored && restored !== clean) {
        memoryArCache.set(cacheKey, restored);
        persistArCache();
      }
      return restored || clean;
    })
    .catch(() => clean)
    .finally(() => {
      inflightRequests.delete(cacheKey);
    });

  inflightRequests.set(cacheKey, promise);
  return promise;
}

export const translateText = translateReviewText;
