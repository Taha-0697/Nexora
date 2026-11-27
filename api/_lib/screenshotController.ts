import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface CapturedScreenshotsResult {
  success: boolean;
  url: string;
  coverImage: string;
  galleryImages: string[];
  title?: string;
  description?: string;
  source: string;
}

function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return true;
  }

  // Block private IPv4 ranges & link-local metadata IPs
  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    if (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    ) {
      return true;
    }
  }

  return false;
}

function normalizeAndValidateTargetUrl(rawUrl: string): URL {
  let trimmed = String(rawUrl || '').trim();
  if (!trimmed) {
    throw new Error('Please enter a valid Project Website URL.');
  }
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Invalid website URL format.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS URLs are supported.');
  }

  if (!parsed.hostname || !parsed.hostname.includes('.') || isBlockedHost(parsed.hostname)) {
    throw new Error('Cannot capture screenshots from local or private network addresses.');
  }

  return parsed;
}

function extFromContentType(contentType: string, fallbackUrl = ''): string {
  const ct = (contentType || '').toLowerCase();
  if (ct.includes('png')) return 'png';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg';
  if (ct.includes('svg')) return 'svg';
  const clean = fallbackUrl.split('?')[0].toLowerCase();
  if (clean.endsWith('.png')) return 'png';
  if (clean.endsWith('.webp')) return 'webp';
  if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) return 'jpg';
  return 'png';
}

async function downloadAndSaveImage(imageUrl: string, slug: string, suffix: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8',
      },
    });
    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('image/')) return null;

    const arrayBuf = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    if (buffer.length < 1024 || buffer.length > 6 * 1024 * 1024) return null;

    const capturesDir = path.resolve(process.cwd(), 'public', 'uploads', 'captures');
    fs.mkdirSync(capturesDir, { recursive: true });

    const ext = extFromContentType(contentType, imageUrl);
    const hash = crypto.createHash('sha1').update(`${slug}-${suffix}-${Date.now()}`).digest('hex').slice(0, 8);
    const safeSlug = slug.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').slice(0, 32) || 'site';
    const fileName = `${safeSlug}-${suffix}-${hash}.${ext}`;
    const filePath = path.join(capturesDir, fileName);

    fs.writeFileSync(filePath, buffer);
    return `/uploads/captures/${fileName}`;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function extractOgImagesFromHtml(targetUrl: string): Promise<{ ogImages: string[]; title?: string; description?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) return { ogImages: [] };
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/html') && !ct.includes('application/xhtml')) return { ogImages: [] };

    const html = (await res.text()).slice(0, 120000);
    const candidates: string[] = [];

    const metaRegex = /<meta\s+[^>]*?(?:property|name)=["'](?:og:image|og:image:secure_url|twitter:image|twitter:image:src)["'][^>]*?content=["']([^"']+)["'][^>]*>/gi;
    const metaRegexRev = /<meta\s+[^>]*?content=["']([^"']+)["'][^>]*?(?:property|name)=["'](?:og:image|og:image:secure_url|twitter:image|twitter:image:src)["'][^>]*>/gi;

    for (const regex of [metaRegex, metaRegexRev]) {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(html)) !== null) {
        try {
          const resolved = new URL(match[1].trim(), targetUrl).toString();
          if (!candidates.includes(resolved)) candidates.push(resolved);
        } catch {
          // ignore malformed relative url
        }
      }
    }

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return {
      ogImages: candidates.slice(0, 3),
      title: titleMatch ? titleMatch[1].trim() : undefined,
    };
  } catch {
    return { ogImages: [] };
  } finally {
    clearTimeout(timer);
  }
}

export async function captureWebsiteScreenshots(rawUrl: string): Promise<CapturedScreenshotsResult> {
  const parsed = normalizeAndValidateTargetUrl(rawUrl);
  const targetUrl = parsed.toString();
  const slug = parsed.hostname.replace(/^www\./i, '');

  const candidateUrls: Array<{ url: string; label: string }> = [];
  let pageTitle: string | undefined;
  let pageDescription: string | undefined;
  let source = 'microlink';

  // 1. Primary: Microlink screenshot + metadata API
  const microController = new AbortController();
  const microTimer = setTimeout(() => microController.abort(), 14000);
  try {
    const microEndpoint = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=true`;
    const microRes = await fetch(microEndpoint, { signal: microController.signal });
    if (microRes.ok) {
      const microJson: any = await microRes.json();
      if (microJson?.status === 'success' && microJson?.data) {
        pageTitle = microJson.data.title || undefined;
        pageDescription = microJson.data.description || undefined;
        if (microJson.data.screenshot?.url) {
          candidateUrls.push({ url: microJson.data.screenshot.url, label: 'desktop' });
        }
        if (microJson.data.image?.url && microJson.data.image.url !== microJson.data.screenshot?.url) {
          candidateUrls.push({ url: microJson.data.image.url, label: 'og' });
        }
      }
    }
  } catch {
    // fallback handled below
  } finally {
    clearTimeout(microTimer);
  }

  // 2. Fallback / supplement: HTML og:image + thum.io screenshot if needed
  if (candidateUrls.length === 0) {
    source = 'fallback';
    const thumUrl = `https://image.thum.io/get/width/1280/crop/800/noanimate/${targetUrl}`;
    candidateUrls.push({ url: thumUrl, label: 'desktop' });
  }

  if (candidateUrls.length < 2) {
    const htmlMeta = await extractOgImagesFromHtml(targetUrl);
    if (!pageTitle && htmlMeta.title) pageTitle = htmlMeta.title;
    for (const og of htmlMeta.ogImages) {
      if (!candidateUrls.some((c) => c.url === og)) {
        candidateUrls.push({ url: og, label: 'preview' });
        break;
      }
    }
  }

  const savedImages: string[] = [];
  for (let i = 0; i < candidateUrls.length; i++) {
    const item = candidateUrls[i];
    const saved = await downloadAndSaveImage(item.url, slug, `${item.label}-${i + 1}`);
    if (saved && !savedImages.includes(saved)) {
      savedImages.push(saved);
    }
  }

  if (savedImages.length === 0) {
    throw new Error(
      'Could not capture a screenshot from this URL. The target site may block automated previews or be unreachable. Please paste an image URL or upload a file manually.'
    );
  }

  return {
    success: true,
    url: targetUrl,
    coverImage: savedImages[0],
    galleryImages: savedImages,
    title: pageTitle,
    description: pageDescription,
    source,
  };
}
