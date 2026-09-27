import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const sellers = await prisma.seller.findMany({
      include: {
        user: { select: { email: true, name: true, phone: true } },
        _count: { select: { products: true, referrals: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ sellers });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch admin sellers' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { sellerId, isApproved, isVerified } = await req.json();

    const seller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        isApproved: isApproved !== undefined ? isApproved : undefined,
        isVerified: isVerified !== undefined ? isVerified : undefined,
      },
    });

    return NextResponse.json({ message: 'Seller status updated', seller });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update seller' }, { status: 500 });
  }
}
