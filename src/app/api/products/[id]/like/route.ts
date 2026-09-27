import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.update({
      where: { id },
      data: {
        likesCount: { increment: 1 },
      },
    });

    return NextResponse.json({ likesCount: product.likesCount });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
}
