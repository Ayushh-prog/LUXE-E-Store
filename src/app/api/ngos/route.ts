import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const ngos = await prisma.nGO.findMany({
      where: { isVerified: true },
      include: {
        _count: {
          select: { donations: true },
        },
      },
      orderBy: { orgName: 'asc' },
    });

    return NextResponse.json({ ngos });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch NGOs' }, { status: 500 });
  }
}
