'use server';

import { createSession, verifyCredentials } from '@/src/core/services/auth.service';
import { redirect } from 'next/navigation';
import { SignupSchema } from '../types/schemas/auth.schema';
import { registerTenant } from '../core/services/auth.service';


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

export async function signupAction(formData: FormData) {
  try {
    // 1. Extract raw data from FormData
    const rawData = {
      companyName: formData.get('companyName'),
      departments: formData.get('departments'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    // 2. Validate against Zod Schema
    const validatedData = SignupSchema.parse(rawData);

    // 3. Hand off to Core Service
    const newUser = await registerTenant(validatedData);

    // 4. Return success state (You would typically handle session creation/JWT here)
    return { success: true, userId: newUser.id };

  } catch (error: any) {
    // Handle Zod validation errors or Service errors (like duplicate emails)
    return { 
      success: false, 
      error: error.errors ? error.errors[0].message : (error.message || "An unexpected error occurred") 
    };
  }
}