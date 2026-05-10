'use server';

import { db } from '@/src/core/db/db.client';
import { createSession, verifyCredentials } from '@/src/core/services/auth.service';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';


export async function handleLogin(formData: FormData) {
  let email = formData.get('email') as string;
  let password = formData.get('password') as string;

  email = "sarah.director@evoedge.com"
  password = "Owner@123"
  if (!email || !password) throw new Error('Missing fields');

  const validUser = await verifyCredentials(email, password);
  
  if (!validUser) {
    throw new Error('Invalid credentials'); 
  }

await createSession({
    userId: validUser.id,
    role: validUser.role,
    companyId: validUser.companyId,
  });

  redirect('/dashboard');
}