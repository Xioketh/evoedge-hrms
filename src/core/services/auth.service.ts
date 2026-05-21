// src/core/services/auth.service.ts
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/src/core/db/db.client';
import bcrypt from 'bcryptjs';
import { SignupInput } from '../../types/schemas/auth.schema';
import { Role } from '@prisma/client';
import { SessionPayload } from '@/src/types/session.types';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod'
);

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
    select: { id: true, password: true, role: true, companyId: true, profile: { select: { firstName: true, lastName: true } } }
  });
  
  if (!user) return null;

  // 2. Verify Password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) return null;

  // 3. Return the safe user data (NEVER return the password)
  return {
    id: user.id,
    role: user.role,
    companyId: user.companyId,
    firstName: user.profile?.firstName || '',
    lastName: user.profile?.lastName || '',
  };
}

export const registerTenant = async (data: SignupInput) => {
  // 1. Pre-flight check: Ensure user doesn't already exist globally
  const existingUser = await db.user.findUnique({ 
    where: { email: data.email } 
  });
  
  if (existingUser) {
    throw new Error('A user with this email already exists.');
  }

  // 2. Hash the password securely
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // 3. Execute the Transaction
  // If anything in this block fails, the database rolls back to its prior state.
  const result = await db.$transaction(async (tx) => {
    
    // Step A: Create the Company
    const company = await tx.company.create({
      data: {
        name: data.companyName,
      },
    });

    // Step B: Create the Departments
    // Using createMany for bulk insertion efficiency
    await tx.department.createMany({
      data: data.departments.map((deptName) => ({
        name: deptName,
        companyId: company.id,
      })),
    });

    // Step C: Create the User and EmployeeProfile via nested writes
    const user = await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: Role.HR_DIRECTOR, // Hardcoded per your requirement
        companyId: company.id,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            // departmentId is left null intentionally. As HR Director, 
            // they can assign themselves to a specific department later in the UI.
          },
        },
      },
      // Return the created profile and company data if the frontend needs it
      include: {
        profile: true,
        company: true,
      },
    });

    return user;
  });

  return result;
};