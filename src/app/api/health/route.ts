import { NextResponse } from 'next/server';
import { checkNeonServices } from '../../../server/neonHealth';

export async function GET() {
  try {
    const health = await checkNeonServices();
    return NextResponse.json(health, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
