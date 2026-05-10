// src/core/services/auth.service.ts
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/src/core/db/db.client';
import bcrypt from 'bcryptjs';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod'
);

export type SessionPayload = {
  userId: string;
  role: string;
  companyId: string;
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(SECRET_KEY);

  // Await the cookies() function here
  const cookieStore = await cookies();
  
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  // Await the cookies() function here too
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function verifyCredentials(email: string, password: string) {
  // 1. Fetch from Database
  const user = await db.user.findUnique({ 
    where: { email },
    select: { id: true, password: true, role: true, companyId: true } 
  });
  
  if (!user) return null;

  // 2. Verify Password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) return null;

  // 3. Return the safe user data (NEVER return the password)
  return {
    id: user.id,
    role: user.role,
    companyId: user.companyId, // Included from our multi-tenant SaaS update!
  };
}