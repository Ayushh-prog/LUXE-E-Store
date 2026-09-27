import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'NGO' && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const ngo = await prisma.nGO.findUnique({
      where: { userId: currentUser.userId },
    });

    const ngoId = ngo ? ngo.id : undefined;

    const allDonations = await prisma.donation.findMany({
      where: ngoId ? { OR: [{ ngoId: ngoId }, { ngoId: null }] } : {},
      include: {
        user: { select: { name: true, email: true, phone: true } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pendingDonations = allDonations.filter(d => ['SUBMITTED', 'UNDER_REVIEW'].includes(d.status)).length;
    const acceptedDonations = allDonations.filter(d => d.status === 'ACCEPTED').length;
    const pickupsScheduled = allDonations.filter(d => d.status === 'PICKUP_SCHEDULED').length;
    const collectedDonations = allDonations.filter(d => d.status === 'COLLECTED').length;
    const distributedDonations = allDonations.filter(d => d.status === 'DISTRIBUTED').length;

    const totalClothesCollected = allDonations
      .filter(d => ['COLLECTED', 'DISTRIBUTED'].includes(d.status))
      .reduce((sum, d) => sum + d.approximateQuantity, 0);

    const peopleSupported = Math.round(totalClothesCollected * 1.8);

    return NextResponse.json({
      ngo,
      stats: {
        pendingDonations,
        acceptedDonations,
        pickupsScheduled,
        collectedDonations,
        distributedDonations,
        totalClothesCollected,
        peopleSupported,
        totalRequests: allDonations.length,
      },
      donations: allDonations,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch NGO metrics' }, { status: 500 });
  }
}
