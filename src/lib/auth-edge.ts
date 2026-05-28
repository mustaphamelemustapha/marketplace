import { SignJWT, jwtVerify } from 'jose';

// Ensure the secret is at least 256 bits (32 characters)
const secretKey = process.env.JWT_SECRET || 'super-secret-key-vtu-marketplace-32-chars-long';
const key = new TextEncoder().encode(secretKey);

export interface UserSessionPayload {
  userId: string;
  email: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
}

export async function signJWT(payload: UserSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifyJWT(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as UserSessionPayload;
  } catch (error) {
    return null;
  }
}
