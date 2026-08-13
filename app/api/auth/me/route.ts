import { NextResponse } from 'next/server';
import { getAuthCookie, verifySessionToken } from '@/lib/auth';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/models/User';

export async function GET() {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = verifySessionToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ user: null });
    }

    await dbConnect();
    const dbUser = await UserModel.findById(payload.userId).lean();
    if (!dbUser) {
      return NextResponse.json({ user: null });
    }

    const user = {
      _id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      status: dbUser.status,
      createdAt: dbUser.createdAt ? new Date(dbUser.createdAt).toISOString() : new Date().toISOString(),
    };

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ user: null });
  }
}
