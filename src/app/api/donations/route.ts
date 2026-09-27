import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { DonationStatus } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let where: any = {};
    if (currentUser.role === 'USER') {
      where.userId = currentUser.userId;
    } else if (currentUser.role === 'NGO') {
      const ngo = await prisma.nGO.findUnique({ where: { userId: currentUser.userId } });
      if (ngo) {
        where.OR = [{ ngoId: ngo.id }, { ngoId: null }];
      }
    }
    // ADMIN gets all donations

    const donations = await prisma.donation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        ngo: { select: { id: true, orgName: true, phone: true, email: true, city: true } },
        user: { select: { id: true, name: true, email: true, phone: true } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    return NextResponse.json({ donations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching donations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required to submit clothing donation' }, { status: 401 });
    }

    const body = await req.json();
    const {
      donorName,
      donorPhone,
      donorEmail,
      streetAddress,
      city,
      state,
      pincode,
      clothingCategory,
      approximateQuantity,
      condition,
      ngoId,
      pickupRequired,
      preferredPickupDate,
      additionalNotes,
    } = body;

    if (!donorName || !donorPhone || !streetAddress || !city || !clothingCategory || !approximateQuantity) {
      return NextResponse.json({ error: 'Please fill in all mandatory donation fields' }, { status: 400 });
    }

    const trackingNumber = `IMP-DON-${Math.floor(100000 + Math.random() * 900000)}`;

    const donation = await prisma.donation.create({
      data: {
        trackingNumber,
        userId: currentUser.userId,
        ngoId: ngoId || null,
        donorName,
        donorPhone,
        donorEmail: donorEmail || currentUser.email,
        streetAddress,
        city,
        state: state || 'State',
        pincode: pincode || '000000',
        clothingCategory,
        approximateQuantity: parseInt(approximateQuantity),
        condition: condition || 'GOOD',
        pickupRequired: pickupRequired ?? true,
        preferredPickupDate: preferredPickupDate || null,
        additionalNotes: additionalNotes || null,
        status: DonationStatus.SUBMITTED,
        statusHistory: {
          create: [
            {
              status: DonationStatus.SUBMITTED,
              notes: 'Donation request created by donor',
              updatedBy: currentUser.name,
            },
          ],
        },
      },
      include: {
        ngo: true,
        statusHistory: true,
      },
    });

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId: currentUser.userId,
        title: 'Donation Submitted!',
        message: `Your donation request ${trackingNumber} has been submitted successfully.`,
        type: 'DONATION',
      },
    });

    return NextResponse.json({ message: 'Donation submitted successfully', donation });
  } catch (error: any) {
    console.error('Donation submission error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit donation' }, { status: 500 });
  }
}
