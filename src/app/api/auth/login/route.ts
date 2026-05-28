import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { INITIAL_USERS } from '@/lib/mock-db';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const emailLower = validatedData.email.toLowerCase();
    
    // Check if it's one of our predefined mock seed users
    const matchedSeedUser = INITIAL_USERS.find(u => u.email === emailLower);
    
    let userPayload;

    if (matchedSeedUser) {
      userPayload = {
        id: matchedSeedUser.id,
        email: matchedSeedUser.email,
        role: matchedSeedUser.role,
        firstName: matchedSeedUser.firstName,
        lastName: matchedSeedUser.lastName,
        businessName: matchedSeedUser.businessName,
      };
    } else {
      // Dynamic fallback for testing custom inputs
      let role: 'BUYER' | 'SELLER' | 'ADMIN' = 'BUYER';
      let businessName = undefined;

      if (emailLower.includes('admin')) {
        role = 'ADMIN';
      } else if (emailLower.includes('seller')) {
        role = 'SELLER';
        businessName = 'Custom Store Shop';
      }

      userPayload = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email: emailLower,
        role,
        firstName: role === 'ADMIN' ? 'System' : 'Test',
        lastName: role === 'ADMIN' ? 'Admin' : 'User',
        businessName,
      };
    }

    const token = await signJWT({
      userId: userPayload.id,
      email: userPayload.email,
      role: userPayload.role,
    });

    const response = NextResponse.json({
      message: 'Login successful (Mocked)',
      user: userPayload,
    });

    // Set cookie
    response.cookies.set({
      name: 'session_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login' },
      { status: 500 }
    );
  }
}
