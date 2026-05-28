import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Create a mock user ID
    const userId = `user-${Math.random().toString(36).substr(2, 9)}`;

    const token = await signJWT({
      userId,
      email: validatedData.email.toLowerCase(),
      role: validatedData.role,
    });

    const response = NextResponse.json(
      {
        message: 'Registration successful (Mocked)',
        user: {
          id: userId,
          email: validatedData.email.toLowerCase(),
          role: validatedData.role,
          firstName: validatedData.firstName || 'User',
          lastName: validatedData.lastName || 'Profile',
          businessName: validatedData.role === 'SELLER' ? validatedData.businessName : undefined,
        },
      },
      { status: 201 }
    );

    // Set HTTP-Only Cookie
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

    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration' },
      { status: 500 }
    );
  }
}
