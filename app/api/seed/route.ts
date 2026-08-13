import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';

export async function GET() {
  try {
    await seedDatabase();
    return NextResponse.json({ success: true, message: 'Database seeded successfully with 16 products!' });
  } catch (error: any) {
    console.error('Seed API error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to seed database' }, { status: 500 });
  }
}
