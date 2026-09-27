import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ items: [] });
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: currentUser.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                seller: { select: { shopName: true, logoUrl: true } },
                images: { orderBy: { position: 'asc' }, take: 1 },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({ items: wishlist ? wishlist.items : [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching wishlist' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Please log in to save items to your wishlist' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: currentUser.userId },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: currentUser.userId },
      });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existing) {
      // Remove if already liked (toggle)
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false, message: 'Removed from wishlist' });
    } else {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
      return NextResponse.json({ saved: true, message: 'Saved to wishlist' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating wishlist' }, { status: 500 });
  }
}
