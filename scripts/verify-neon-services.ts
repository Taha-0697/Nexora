import 'dotenv/config';
import { prisma, uploadToNeonStorage, deleteFromNeonStorage, listNeonStorageObjects, BUCKET_NAME } from '../src/lib/neon.ts';

async function verifyAll() {
  console.log('==============================================');
  console.log('       NEXORA — NEON SERVICES VERIFICATION    ');
  console.log('==============================================\n');

  let allPassed = true;

  // 1. TEST NEON POSTGRES (PRISMA)
  console.log('▶ [1/3] Testing Neon PostgreSQL...');
  try {
    const initialCount = await prisma.project.count();
    console.log(`  ✓ Connected to Neon Postgres (Database: neondb)`);
    console.log(`  ✓ Existing projects count in DB: ${initialCount}`);

    // Create a temporary test project
    const testProject = await prisma.project.create({
      data: {
        titleEn: 'Neon Verification Test Deliverable',
        titleAr: 'مشروع فحص خدمات نيون',
        category: 'CLOUD',
        clientName: 'Neon Systems Verification',
        region: 'Global / Multi-region',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        hasLiveDemo: true,
        liveDemoUrl: 'https://neon.tech',
        techStack: ['PostgreSQL', 'Prisma', 'Neon'],
      },
    });
    console.log(`  ✓ Successfully wrote test record (ID: ${testProject.id})`);

    // Verify it exists
    const fetched = await prisma.project.findUnique({ where: { id: testProject.id } });
    if (!fetched) throw new Error('Test project could not be re-read');
    console.log(`  ✓ Verified test record readable: "${fetched.titleEn}"`);

    // Delete the temporary test project
    await prisma.project.delete({ where: { id: testProject.id } });
    console.log(`  ✓ Successfully cleaned up test record from database`);
    console.log('  ★ POSTGRES: PASSED\n');
  } catch (err: any) {
    allPassed = false;
    console.error('  ✗ POSTGRES ERROR:', err.message, '\n');
  }

  // 2. TEST NEON AUTH (MANAGED BETTER AUTH)
  console.log('▶ [2/3] Testing Neon Auth (Managed Better Auth)...');
  try {
    const authUrl = process.env.NEON_AUTH_BASE_URL;
    const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
    console.log(`  ✓ Auth Base URL: ${authUrl}`);
    console.log(`  ✓ JWKS URL: ${jwksUrl}`);

    if (!jwksUrl) throw new Error('NEON_AUTH_JWKS_URL is missing in .env');
    const jwksRes = await fetch(jwksUrl);
    if (!jwksRes.ok) throw new Error(`JWKS endpoint returned HTTP ${jwksRes.status}`);

    const jwksData = await jwksRes.json();
    console.log(`  ✓ Successfully reached Neon Auth endpoint (Keys returned: ${jwksData.keys?.length ?? 0})`);
    console.log('  ★ NEON AUTH: PASSED\n');
  } catch (err: any) {
    allPassed = false;
    console.error('  ✗ NEON AUTH ERROR:', err.message, '\n');
  }

  // 3. TEST NEON OBJECT STORAGE (S3-COMPATIBLE BUCKET)
  console.log('▶ [3/3] Testing Neon Object Storage...');
  try {
    console.log(`  ✓ S3 Endpoint: ${process.env.AWS_ENDPOINT_URL_S3}`);
    console.log(`  ✓ Bucket: ${BUCKET_NAME}`);
    console.log(`  ✓ Region: ${process.env.AWS_REGION}`);

    const testFileKey = `test-verify-${Date.now()}.json`;
    const testPayload = JSON.stringify({
      system: 'Nexora Command Center',
      timestamp: new Date().toISOString(),
      service: 'Neon Object Storage',
    });

    const fileUrl = await uploadToNeonStorage(testFileKey, testPayload, 'application/json');
    console.log(`  ✓ Successfully uploaded test asset to bucket: "${testFileKey}"`);
    console.log(`  ✓ Generated Object Storage URL: ${fileUrl}`);

    const list = await listNeonStorageObjects();
    console.log(`  ✓ Successfully listed bucket contents (Objects in bucket: ${list.KeyCount ?? 0})`);

    await deleteFromNeonStorage(testFileKey);
    console.log(`  ✓ Successfully deleted test asset from bucket`);
    console.log('  ★ OBJECT STORAGE: PASSED\n');
  } catch (err: any) {
    allPassed = false;
    console.error('  ✗ OBJECT STORAGE ERROR:', err.message, '\n');
  }

  console.log('==============================================');
  if (allPassed) {
    console.log('   🎉 ALL 3 NEON SERVICES VERIFIED & HEALTHY  ');
  } else {
    console.log('   ⚠️ SOME SERVICE CHECKS ENCOUNTERED ISSUES  ');
  }
  console.log('==============================================');

  process.exit(allPassed ? 0 : 1);
}

verifyAll();
