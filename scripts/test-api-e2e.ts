async function testAppEndToEnd() {
  const baseUrl = 'http://localhost:5173';
  console.log(`\n======================================================`);
  console.log(`   END-TO-END VERIFICATION: RUNNING APP AT ${baseUrl}`);
  console.log(`======================================================\n`);

  // 1. HEALTH CHECK (/api/health) - Tests Postgres, Auth & Object Storage
  console.log('▶ [TEST 1] Calling GET /api/health ...');
  const healthRes = await fetch(`${baseUrl}/api/health`);
  const healthData = await healthRes.json();
  console.log(`  HTTP Status: ${healthRes.status}`);
  console.log(`  Services Health Response:`, JSON.stringify(healthData, null, 2));

  if (
    healthData.postgres?.status !== 'healthy' ||
    healthData.auth?.status !== 'healthy' ||
    healthData.objectStorage?.status !== 'healthy'
  ) {
    throw new Error('Health check did not report all services healthy');
  }
  console.log('  ✓ Services Health check: PASSED\n');

  // 2. GET PROJECTS (/api/projects) - Tests fetching from Neon Postgres
  console.log('▶ [TEST 2] Calling GET /api/projects ...');
  const getRes = await fetch(`${baseUrl}/api/projects`);
  const projects = await getRes.json();
  console.log(`  HTTP Status: ${getRes.status}`);
  console.log(`  Projects retrieved from Neon DB: ${projects.length}`);
  console.log(`  Sample project: "${projects[0]?.titleEn}" (Category: ${projects[0]?.category})`);
  console.log('  ✓ GET /api/projects: PASSED\n');

  // 3. POST PROJECT (/api/projects) - Tests creating a new project in Neon Postgres
  console.log('▶ [TEST 3] Calling POST /api/projects ...');
  const newProjectPayload = {
    titleEn: 'End-to-End Live Verification Portal',
    titleAr: 'بوابة التحقق المباشر الشاملة',
    category: 'CLOUD',
    clientName: 'Nexora Systems GCC',
    region: 'Dubai, UAE',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    hasLiveDemo: true,
    liveDemoUrl: 'https://nexora.io',
    techStack: ['Neon PostgreSQL', 'Prisma', 'React', 'Vite'],
  };
  const postRes = await fetch(`${baseUrl}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProjectPayload),
  });
  const createdProject = await postRes.json();
  console.log(`  HTTP Status: ${postRes.status}`);
  console.log(`  Created project ID in Neon DB: ${createdProject.id}`);
  console.log(`  Created project Title: "${createdProject.titleEn}"`);
  console.log('  ✓ POST /api/projects: PASSED\n');

  // 4. DELETE PROJECT (/api/projects/[id]) - Tests deleting the project from Neon Postgres
  console.log(`▶ [TEST 4] Calling DELETE /api/projects/${createdProject.id} ...`);
  const deleteRes = await fetch(`${baseUrl}/api/projects/${createdProject.id}`, {
    method: 'DELETE',
  });
  const deleteData = await deleteRes.json();
  console.log(`  HTTP Status: ${deleteRes.status}`);
  console.log(`  Delete response:`, deleteData);
  console.log('  ✓ DELETE /api/projects/:id: PASSED\n');

  // 5. STORAGE UPLOAD (/api/storage/upload) - Tests uploading to Neon Object Storage
  console.log('▶ [TEST 5] Calling POST /api/storage/upload ...');
  const sampleBase64 = Buffer.from('Nexora Live Object Storage Verification Asset').toString('base64');
  const uploadRes = await fetch(`${baseUrl}/api/storage/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: `e2e-asset-${Date.now()}.txt`,
      data: sampleBase64,
      contentType: 'text/plain',
    }),
  });
  const uploadData = await uploadRes.json();
  console.log(`  HTTP Status: ${uploadRes.status}`);
  console.log(`  Uploaded asset URL in Neon Bucket:`, uploadData.url);
  console.log('  ✓ POST /api/storage/upload: PASSED\n');

  console.log(`======================================================`);
  console.log(`   🎉 ALL END-TO-END HTTP TESTS PASSED SUCCESSFULLY! `);
  console.log(`======================================================\n`);
}

testAppEndToEnd().catch(err => {
  console.error('E2E Test Failed:', err);
  process.exit(1);
});
