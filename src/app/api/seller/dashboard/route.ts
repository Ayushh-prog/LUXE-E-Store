import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'SELLER' && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: currentUser.userId },
      include: {
        products: {
          include: {
            category: true,
            _count: { select: { referrals: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!seller && currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    const sellerId = seller ? seller.id : (await prisma.seller.findFirst())?.id;

    if (!sellerId) {
      return NextResponse.json({ stats: {}, products: [], referrals: [] });
    }

    const totalProducts = await prisma.product.count({ where: { sellerId } });
    const totalReferralClicks = await prisma.referral.count({ where: { sellerId } });
    
    const conversions = await prisma.conversion.findMany({
      where: { referral: { sellerId } },
      include: { referral: { include: { product: true } } },
    });

    const totalConversions = conversions.length;
    const totalRevenueGenerated = conversions.reduce((sum, c) => sum + c.orderValue, 0);
    const totalEstimatedCommission = conversions.reduce((sum, c) => sum + c.commissionAmount, 0);

    const recentReferrals = await prisma.referral.findMany({
      where: { sellerId },
      take: 10,
      orderBy: { clickedAt: 'desc' },
      include: {
        product: { select: { title: true, price: true } },
        conversion: true,
      },
    });

    return NextResponse.json({
      seller,
      stats: {
        totalProducts,
        totalReferralClicks,
        totalConversions,
        totalRevenueGenerated,
        totalEstimatedCommission,
      },
      products: seller?.products || [],
      recentReferrals,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch seller metrics' }, { status: 500 });
  }
}
