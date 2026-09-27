import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-social-impact-key-2026';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'USER' | 'SELLER' | 'NGO' | 'ADMIN';
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function signJwtToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwtToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    return verifyJwtToken(token);
  } catch (error) {
    return null;
  }
}

export async function getFullCurrentUser() {
  const userPayload = await getCurrentUser();
  if (!userPayload) return null;

  const user = await prisma.user.findUnique({
    where: { id: userPayload.userId },
    include: {
      sellerProfile: true,
      ngoProfile: true,
      addresses: true,
    },
  });

  return user;
}
