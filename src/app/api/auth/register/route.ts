import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signJwtToken } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone, role, shopName, websiteUrl, orgName, registrationNumber, address, description } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields (email, password, name)' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const assignedRole = (role as Role) || Role.USER;

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone: phone || null,
        role: assignedRole,
      },
    });

    // Handle Seller / NGO profiles if specified during registration
    if (assignedRole === Role.SELLER && shopName) {
      await prisma.seller.create({
        data: {
          userId: user.id,
          shopName,
          websiteUrl: websiteUrl || 'https://example.com',
          description: description || 'Clothing Boutique Partner',
          isApproved: true,
          isVerified: true,
        },
      });
    } else if (assignedRole === Role.NGO && orgName) {
      await prisma.nGO.create({
        data: {
          userId: user.id,
          orgName,
          registrationNumber: registrationNumber || `NGO-${Math.floor(10000 + Math.random() * 90000)}`,
          description: description || 'Clothing Donation NGO Partner',
          address: address || 'Main City Office',
          city: 'Delhi',
          state: 'Delhi',
          phone: phone || '9999999999',
          email,
          donationRequirements: 'Accepting clean wearable apparel.',
          isVerified: true, // Auto verified for smooth demo experience
        },
      });
    }

    const token = signJwtToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
