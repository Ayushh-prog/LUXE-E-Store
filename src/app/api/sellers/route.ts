import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sellers = await prisma.seller.findMany({
      where: { isApproved: true },
      include: {
        _count: {
          select: { products: true, referrals: true },
        },
      },
      orderBy: { shopName: 'asc' },
    });

    return NextResponse.json({ sellers });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch sellers' }, { status: 500 });
  }
}
