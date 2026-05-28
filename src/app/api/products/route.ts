import { NextResponse } from 'next/server';
import { INITIAL_PRODUCTS } from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json({ products: INITIAL_PRODUCTS });
}
