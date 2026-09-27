import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
        seller: { select: { shopName: true } },
        _count: { select: { referrals: true, wishlistItems: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch admin products' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { productId, isApproved, isFeatured, isAvailable } = await req.json();

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        isApproved: isApproved !== undefined ? isApproved : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured : undefined,
        isAvailable: isAvailable !== undefined ? isAvailable : undefined,
      },
    });

    return NextResponse.json({ message: 'Product updated', product });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
