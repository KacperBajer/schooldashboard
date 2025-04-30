import { openByUrlWithToken } from '@/lib/barriers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Missing token' }, { status: 400 });
  }

  const open = await openByUrlWithToken(token);

  if (open.status === 'error') {
    return NextResponse.json({ message: `error: ${open.error}` }, { status: 500 });
  }

  return NextResponse.json({ message: 'success' }, { status: 200 });
}
