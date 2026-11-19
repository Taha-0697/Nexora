import { NextResponse } from 'next/server';
import { uploadToNeonStorage } from '../../../../lib/neon';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filename = body.filename || `project-${Date.now()}.png`;
    const base64Data = body.data || '';
    const buffer = Buffer.from(base64Data, 'base64');
    const contentType = body.contentType || 'image/png';

    const url = await uploadToNeonStorage(filename, buffer, contentType);
    return NextResponse.json({ success: true, url, filename }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
