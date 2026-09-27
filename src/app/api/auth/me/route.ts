import { NextResponse } from 'next/server';
import { getFullCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getFullCurrentUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const { passwordHash, ...safeUser } = user;

  return NextResponse.json({ user: safeUser }, { status: 200 });
}
