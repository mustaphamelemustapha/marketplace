import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth-edge';
import { INITIAL_USERS } from '@/lib/mock-db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Match seed user if present, or return decoded metadata directly
    const matchedSeedUser = INITIAL_USERS.find(u => u.id === decoded.userId || u.email === decoded.email.toLowerCase());

    const user = matchedSeedUser
      ? {
          id: matchedSeedUser.id,
          email: matchedSeedUser.email,
          role: matchedSeedUser.role,
          profile: {
            firstName: matchedSeedUser.firstName,
            lastName: matchedSeedUser.lastName,
            businessName: matchedSeedUser.businessName,
            bio: matchedSeedUser.bio,
            phoneNumber: matchedSeedUser.phoneNumber,
            address: matchedSeedUser.address,
          },
        }
      : {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          profile: {
            firstName: decoded.role === 'ADMIN' ? 'System' : 'Test',
            lastName: decoded.role === 'ADMIN' ? 'Admin' : 'User',
            businessName: decoded.role === 'SELLER' ? 'Custom Store Shop' : undefined,
          },
        };

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Fetch Me Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
