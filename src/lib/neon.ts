import 'dotenv/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { createAuthClient } from '@neon/auth';
import { prisma } from './prisma.ts';

// 1. Neon Postgres
export { prisma };

// 2. Neon Auth (Managed Better Auth)
const authBaseUrl = process.env.NEON_AUTH_BASE_URL || 'https://auth.neon.tech';
export const authClient = createAuthClient(authBaseUrl);

// 3. Neon Object Storage (S3-compatible)
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

export const BUCKET_NAME = 'assets';

export async function uploadToNeonStorage(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType = 'application/octet-stream'
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: typeof body === 'string' ? Buffer.from(body) : body,
    ContentType: contentType,
  });

  await s3Client.send(command);

  const endpoint = process.env.AWS_ENDPOINT_URL_S3?.replace(/\/$/, '') || '';
  return `${endpoint}/${BUCKET_NAME}/${key}`;
}

export async function deleteFromNeonStorage(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  return await s3Client.send(command);
}

export async function listNeonStorageObjects() {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    MaxKeys: 20,
  });
  return await s3Client.send(command);
}
