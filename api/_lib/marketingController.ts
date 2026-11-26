import { prisma } from './prisma.js';

// --- MARKETING CAMPAIGNS ---
export async function getAllMarketingCampaigns() {
  return await prisma.marketingCampaign.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createMarketingCampaign(data: any) {
  const name = String(data.name || 'Untitled Campaign').trim();
  const platform = String(data.platform || 'Google Ads').trim();
  const impressions = Number(data.impressions) || 0;
  const clicks = Number(data.clicks) || 0;
  const conversions = Number(data.conversions) || 0;
  const spendAmount = Number(data.spendAmount || data.spent) || 0;
  const dailyBudget = Number(data.dailyBudget) || 0;
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : Number(data.ctr) || 0;
  const roas = spendAmount > 0 ? Number(data.roas) || (conversions * 250) / spendAmount : 0;

  return await prisma.marketingCampaign.create({
    data: {
      name,
      platform,
      status: (data.status || 'active').toLowerCase(),
      targetRegion: data.targetRegion || 'GCC / Middle East',
      dailyBudget,
      spendAmount,
      impressions,
      clicks,
      ctr,
      conversions,
      roas,
    },
  });
}

export async function updateMarketingCampaign(id: string, data: any) {
  if (!id) throw new Error('Campaign ID is required.');
  const updateData: any = {};

  if (data.name !== undefined) updateData.name = String(data.name).trim();
  if (data.platform !== undefined) updateData.platform = String(data.platform).trim();
  if (data.status !== undefined) updateData.status = String(data.status).toLowerCase();
  if (data.targetRegion !== undefined) updateData.targetRegion = String(data.targetRegion);
  if (data.dailyBudget !== undefined) updateData.dailyBudget = Number(data.dailyBudget);
  if (data.spendAmount !== undefined || data.spent !== undefined) {
    updateData.spendAmount = Number(data.spendAmount || data.spent);
  }
  if (data.impressions !== undefined) updateData.impressions = Number(data.impressions);
  if (data.clicks !== undefined) updateData.clicks = Number(data.clicks);
  if (data.conversions !== undefined) updateData.conversions = Number(data.conversions);
  if (data.ctr !== undefined) updateData.ctr = Number(data.ctr);
  if (data.roas !== undefined) updateData.roas = Number(data.roas);

  return await prisma.marketingCampaign.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteMarketingCampaign(id: string) {
  if (!id) throw new Error('Campaign ID is required.');
  const deleted = await prisma.marketingCampaign.delete({
    where: { id },
  });
  return { success: true, deletedId: deleted.id };
}

// --- MARKETING POST ADS (COMPOSER) ---
export async function getAllMarketingPosts() {
  return await prisma.marketingPostAd.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createMarketingPost(data: any) {
  const title = String(data.title || data.headline || 'New Post').trim();
  const content = String(data.content || data.copy || '').trim();

  let targetNetworks: string[] = [];
  if (Array.isArray(data.targetNetworks)) {
    targetNetworks = data.targetNetworks.map(String).filter(Boolean);
  } else if (Array.isArray(data.platforms)) {
    targetNetworks = data.platforms.map(String).filter(Boolean);
  } else if (typeof data.targetNetworks === 'string') {
    targetNetworks = data.targetNetworks.split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  return await prisma.marketingPostAd.create({
    data: {
      title,
      headline: data.headline || null,
      content,
      mediaUrl: data.mediaUrl || null,
      ctaLabel: data.ctaLabel || data.ctaText || null,
      ctaUrl: data.ctaUrl || data.targetUrl || null,
      targetNetworks,
      status: (data.status || 'draft').toLowerCase(),
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : (data.status === 'published' ? new Date() : null),
    },
  });
}

export async function updateMarketingPost(id: string, data: any) {
  if (!id) throw new Error('Post ID is required.');
  const updateData: any = {};

  if (data.title !== undefined) updateData.title = String(data.title).trim();
  if (data.headline !== undefined) updateData.headline = data.headline;
  if (data.content !== undefined || data.copy !== undefined) {
    updateData.content = String(data.content || data.copy).trim();
  }
  if (data.mediaUrl !== undefined) updateData.mediaUrl = data.mediaUrl;
  if (data.ctaLabel !== undefined || data.ctaText !== undefined) {
    updateData.ctaLabel = data.ctaLabel || data.ctaText;
  }
  if (data.ctaUrl !== undefined || data.targetUrl !== undefined) {
    updateData.ctaUrl = data.ctaUrl || data.targetUrl;
  }
  if (data.status !== undefined) updateData.status = String(data.status).toLowerCase();
  if (data.scheduledAt !== undefined) {
    updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
  }
  if (data.publishedAt !== undefined) {
    updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
  }

  return await prisma.marketingPostAd.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteMarketingPost(id: string) {
  if (!id) throw new Error('Post ID is required.');
  const deleted = await prisma.marketingPostAd.delete({
    where: { id },
  });
  return { success: true, deletedId: deleted.id };
}

// --- MARKETING ACCOUNT CONNECTIONS ---
export async function getAllAccountConnections() {
  const connections = await prisma.marketingAccountConnection.findMany({
    orderBy: { platform: 'asc' },
  });

  if (connections.length === 0) {
    // Seed default connections if empty
    const defaults = [
      {
        platform: 'Google Ads',
        accountName: 'Nexora Systems Global (Search & Demand Gen)',
        accountId: '824-910-4491',
        status: 'connected',
        webhookUrl: 'https://api.nexora.io/v1/webhooks/google-ads',
        apiKeyMasked: 'AIzaSyD984••••••••••••••••382kL',
        developerToken: 'dev-tok-98402941-nx',
      },
      {
        platform: 'Meta Ads',
        accountName: 'Nexora Systems (Facebook & Instagram Business)',
        accountId: 'act_94820194820',
        status: 'connected',
        webhookUrl: 'https://api.nexora.io/v1/webhooks/meta-conversions',
        apiKeyMasked: 'EAAG9824••••••••••••••••ZAd10',
        developerToken: 'graph-api-v20.0',
      },
      {
        platform: 'LinkedIn',
        accountName: 'Nexora Systems Official Page (B2B Enterprise)',
        accountId: 'urn:li:organization:8492041',
        status: 'connected',
        webhookUrl: 'https://api.nexora.io/v1/webhooks/linkedin-leads',
        apiKeyMasked: 'AQVz••••••••••••••••09Lp',
        developerToken: 'linkedin-marketing-developer',
      },
      {
        platform: 'X',
        accountName: '@NexoraSystems (X Ads & Developer API v2)',
        accountId: 'x-ad-account-583091',
        status: 'connected',
        webhookUrl: 'https://api.nexora.io/v1/webhooks/x-campaigns',
        apiKeyMasked: 'Bearer AAAAAAAAAAAAAAAAAAAA••••••••3a9f',
        developerToken: 'x-api-v2-developer',
      },
    ];

    for (const d of defaults) {
      await prisma.marketingAccountConnection.upsert({
        where: { platform: d.platform },
        update: {},
        create: d,
      });
    }

    return await prisma.marketingAccountConnection.findMany({
      orderBy: { platform: 'asc' },
    });
  }

  return connections;
}

export async function updateAccountConnection(platform: string, data: any) {
  return await prisma.marketingAccountConnection.upsert({
    where: { platform },
    update: {
      accountName: data.accountName,
      accountId: data.accountId,
      status: data.status,
      webhookUrl: data.webhookUrl,
      apiKeyMasked: data.apiKeyMasked,
      developerToken: data.developerToken,
      lastSyncedAt: new Date(),
    },
    create: {
      platform,
      accountName: data.accountName,
      accountId: data.accountId,
      status: data.status || 'connected',
      webhookUrl: data.webhookUrl,
      apiKeyMasked: data.apiKeyMasked,
      developerToken: data.developerToken,
      lastSyncedAt: new Date(),
    },
  });
}

// --- MARKETING BANNER & PIXEL SETTINGS ---
export async function getMarketingBannerPixel() {
  const first = await prisma.marketingBannerPixel.findFirst();
  if (first) return first;

  return await prisma.marketingBannerPixel.create({
    data: {
      bannerActive: true,
      bannerText: '⚡ GCC Tech Expansion: Custom .NET Core & Odoo ERP Modernization Available for Q1-Q2 2026',
      bannerCtaLabel: 'Claim Advisory Slot',
      bannerCtaUrl: '#contact',
      googleAdsPixel: 'AW-948201948',
      metaPixel: '294820194820194',
      linkedinPixel: '9482019',
      xPixel: 'tw-nx-49201',
    },
  });
}

export async function updateMarketingBannerPixel(data: any) {
  const existing = await getMarketingBannerPixel();
  const updateData: any = {};

  if (data.bannerActive !== undefined) updateData.bannerActive = Boolean(data.bannerActive);
  if (data.bannerText !== undefined) updateData.bannerText = String(data.bannerText);
  if (data.bannerCtaLabel !== undefined) updateData.bannerCtaLabel = String(data.bannerCtaLabel);
  if (data.bannerCtaUrl !== undefined) updateData.bannerCtaUrl = String(data.bannerCtaUrl);
  if (data.googleAdsPixel !== undefined) updateData.googleAdsPixel = data.googleAdsPixel;
  if (data.metaPixel !== undefined) updateData.metaPixel = data.metaPixel;
  if (data.linkedinPixel !== undefined) updateData.linkedinPixel = data.linkedinPixel;
  if (data.xPixel !== undefined) updateData.xPixel = data.xPixel;

  return await prisma.marketingBannerPixel.update({
    where: { id: existing.id },
    data: updateData,
  });
}
