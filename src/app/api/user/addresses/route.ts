import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const addresses = await prisma.address.findMany({
      where: { userId: currentUser.userId },
      orderBy: { isDefault: 'desc' },
    });

    return NextResponse.json({ addresses });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { fullName, phone, streetAddress, city, state, pincode, isDefault } = body;

    if (isDefault) {
      // Unset previous defaults
      await prisma.address.updateMany({
        where: { userId: currentUser.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: currentUser.userId,
        fullName,
        phone,
        streetAddress,
        city,
        state,
        pincode,
        isDefault: isDefault ?? false,
      },
    });

    return NextResponse.json({ address });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
}
