import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const donation = await prisma.donation.findFirst({
      where: {
        OR: [{ id }, { trackingNumber: id }],
      },
      include: {
        ngo: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    return NextResponse.json({ donation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching donation' }, { status: 500 });
  }
}
