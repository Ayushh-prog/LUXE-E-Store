import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const totalUsers = await prisma.user.count();
    const totalSellers = await prisma.seller.count();
    const verifiedNGOs = await prisma.nGO.count({ where: { isVerified: true } });
    const totalProducts = await prisma.product.count();
    const totalReferrals = await prisma.referral.count();
    const totalConversions = await prisma.conversion.count();
    const totalDonations = await prisma.donation.count();

    const donationsData = await prisma.donation.findMany({
      select: {
        approximateQuantity: true,
        status: true,
      },
    });

    const totalClothesDonated = donationsData.reduce((acc, curr) => acc + curr.approximateQuantity, 0);
    const collectedClothes = donationsData
      .filter(d => ['COLLECTED', 'DISTRIBUTED'].includes(d.status))
      .reduce((acc, curr) => acc + curr.approximateQuantity, 0);

    const conversionsData = await prisma.conversion.findMany({
      select: {
        commissionAmount: true,
        orderValue: true,
      },
    });

    const totalCommissionEst = conversionsData.reduce((acc, curr) => acc + curr.commissionAmount, 0);
    const totalGrossMerchandise = conversionsData.reduce((acc, curr) => acc + curr.orderValue, 0);

    return NextResponse.json({
      analytics: {
        totalUsers,
        totalSellers,
        verifiedNGOs,
        totalProducts,
        totalReferrals,
        totalConversions,
        totalDonations,
        totalClothesDonated,
        collectedClothes,
        peopleSupportedEst: Math.round(collectedClothes * 1.8),
        totalCommissionEst: parseFloat(totalCommissionEst.toFixed(2)),
        totalGrossMerchandise: parseFloat(totalGrossMerchandise.toFixed(2)),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 });
  }
}
