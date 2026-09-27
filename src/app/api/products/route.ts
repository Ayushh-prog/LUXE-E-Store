import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sellerId = searchParams.get('sellerId') || '';
    const size = searchParams.get('size') || '';
    const color = searchParams.get('color') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000000');
    const featured = searchParams.get('featured') === 'true';
    const sortBy = searchParams.get('sortBy') || 'newest'; // newest, price_asc, price_desc, popular

    const where: any = {
      isAvailable: true,
      isApproved: true,
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (sellerId) {
      where.sellerId = sellerId;
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (size) {
      where.sizes = { contains: size };
    }

    if (color) {
      where.colors = { contains: color };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'popular') orderBy = { likesCount: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            shopName: true,
            logoUrl: true,
            websiteUrl: true,
            location: true,
          },
        },
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return NextResponse.json({ products, total: products.length });
  } catch (error: any) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'SELLER' && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized. Seller access required.' }, { status: 403 });
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: currentUser.userId },
    });

    if (!seller && currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const { title, description, price, originalPrice, categoryId, sizes, colors, material, brand, externalProductUrl, imageUrls } = body;

    if (!title || !description || !price || !categoryId || !externalProductUrl) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        categoryId,
        sellerId: seller ? seller.id : body.sellerId,
        sizes: sizes || 'S,M,L',
        colors: colors || 'Black,White',
        material: material || 'Organic Cotton',
        brand: brand || seller?.shopName || 'Artisan',
        externalProductUrl,
        images: {
          create: (imageUrls && imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800']).map((url: string, index: number) => ({
            url,
            position: index,
          })),
        },
      },
      include: {
        images: true,
        category: true,
        seller: true,
      },
    });

    return NextResponse.json({ message: 'Product created successfully', product });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
