import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const ngos = await prisma.nGO.findMany({
      include: {
        user: { select: { email: true, name: true, phone: true } },
        _count: { select: { donations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ ngos });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch admin NGOs' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { ngoId, isVerified } = await req.json();

    const ngo = await prisma.nGO.update({
      where: { id: ngoId },
      data: { isVerified },
    });

    return NextResponse.json({ message: 'NGO verification status updated', ngo });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update NGO' }, { status: 500 });
  }
}
