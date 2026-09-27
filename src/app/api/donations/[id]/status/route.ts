import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { DonationStatus } from '@prisma/client';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'NGO' && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized. NGO or Admin access required.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, notes, preferredPickupDate } = body;

    if (!status || !Object.values(DonationStatus).includes(status as DonationStatus)) {
      return NextResponse.json({ error: 'Invalid donation status' }, { status: 400 });
    }

    const donation = await prisma.donation.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    // Update donation status & add history record
    const updatedDonation = await prisma.donation.update({
      where: { id },
      data: {
        status: status as DonationStatus,
        preferredPickupDate: preferredPickupDate || donation.preferredPickupDate,
        statusHistory: {
          create: {
            status: status as DonationStatus,
            notes: notes || `Status updated to ${status}`,
            updatedBy: currentUser.name,
          },
        },
      },
      include: {
        ngo: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    // Notify donor user
    await prisma.notification.create({
      data: {
        userId: donation.userId,
        title: `Donation Status Update: ${status}`,
        message: `Your donation #${donation.trackingNumber} status is now ${status.replace('_', ' ')}. ${notes ? `Note: ${notes}` : ''}`,
        type: 'DONATION',
      },
    });

    return NextResponse.json({ message: 'Donation status updated', donation: updatedDonation });
  } catch (error: any) {
    console.error('Update donation status error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update donation status' }, { status: 500 });
  }
}
