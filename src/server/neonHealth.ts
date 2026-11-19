import 'dotenv/config';
import { prisma, uploadToNeonStorage, deleteFromNeonStorage, listNeonStorageObjects, BUCKET_NAME } from '../lib/neon.ts';

export async function checkNeonServices() {
  const results: Record<string, any> = {};

  // 1. Check Postgres
  try {
    const projectCount = await prisma.project.count();
    results.postgres = {
      status: 'healthy',
      message: 'Connected to Neon PostgreSQL',
      branch: process.env.NEON_BRANCH || 'production',
      projectsCount: projectCount,
    };
  } catch (err: any) {
    results.postgres = {
      status: 'error',
      message: err.message,
    };
  }

  // 2. Check Neon Auth
  try {
    const authBaseUrl = process.env.NEON_AUTH_BASE_URL;
    const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
    if (!authBaseUrl || !jwksUrl) {
      throw new Error('NEON_AUTH_BASE_URL or NEON_AUTH_JWKS_URL missing in environment');
    }

    const jwksRes = await fetch(jwksUrl);
    results.auth = {
      status: jwksRes.ok ? 'healthy' : 'degraded',
      message: jwksRes.ok ? 'Neon Auth JWKS endpoint responsive' : `HTTP ${jwksRes.status}`,
      baseUrl: authBaseUrl,
      jwksUrl,
    };
  } catch (err: any) {
    results.auth = {
      status: 'error',
      message: err.message,
    };
  }

  // 3. Check Object Storage
  try {
    const testKey = `health-check-${Date.now()}.txt`;
    const testContent = `Neon Object Storage Test - ${new Date().toISOString()}`;
    const uploadedUrl = await uploadToNeonStorage(testKey, testContent, 'text/plain');
    const listRes = await listNeonStorageObjects();
    await deleteFromNeonStorage(testKey);

    results.objectStorage = {
      status: 'healthy',
      message: 'Successfully put, listed, and deleted object in Neon S3 bucket',
      bucket: BUCKET_NAME,
      region: process.env.AWS_REGION,
      testUrl: uploadedUrl,
      objectsInBucket: listRes.KeyCount ?? 0,
    };
  } catch (err: any) {
    results.objectStorage = {
      status: 'error',
      message: err.message,
    };
  }

  return results;
}
