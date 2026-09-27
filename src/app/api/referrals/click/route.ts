import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { productId, source } = await req.json();
    const currentUser = await getCurrentUser();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const trackingCode = `REF-${currentUser ? currentUser.userId.slice(0, 5) : 'GUEST'}-${Date.now()}`;

    // Create referral tracking entry in database
    const referral = await prisma.referral.create({
      data: {
        userId: currentUser?.userId || null,
        productId: product.id,
        sellerId: product.sellerId,
        trackingCode,
        source: source || 'product_detail',
      },
    });

    // Simulate 20% conversion probability for rich realistic analytics demo!
    const shouldSimulateConversion = Math.random() < 0.25;
    if (shouldSimulateConversion) {
      const commAmount = (product.price * (product.commissionValue / 100));
      await prisma.conversion.create({
        data: {
          referralId: referral.id,
          orderValue: product.price,
          commissionAmount: parseFloat(commAmount.toFixed(2)),
          status: 'APPROVED',
        },
      });
    }

    // Append tracking code parameters to destination URL
    const destinationUrl = new URL(product.externalProductUrl);
    destinationUrl.searchParams.set('ref_source', 'social_impact_platform');
    destinationUrl.searchParams.set('ref_code', trackingCode);
    destinationUrl.searchParams.set('ref_id', referral.id);

    return NextResponse.json({
      success: true,
      referralId: referral.id,
      trackingCode,
      redirectUrl: destinationUrl.toString(),
    });
  } catch (error: any) {
    console.error('Referral tracking error:', error);
    return NextResponse.json({ error: error.message || 'Error processing referral' }, { status: 500 });
  }
}
