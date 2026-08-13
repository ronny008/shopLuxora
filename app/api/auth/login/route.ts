import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/models/User';
import { verifyPassword, createSessionToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    let foundUser: any = null;
    let isValidPassword = false;

    await dbConnect();
    const dbUser = await UserModel.findOne({ email: cleanEmail }).select('+password');
    
    if (dbUser) {
      if (dbUser.password) {
        isValidPassword = verifyPassword(password, dbUser.password);
      } else {
        isValidPassword = true;
      }

      if (isValidPassword) {
        foundUser = {
          _id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          status: dbUser.status,
          createdAt: dbUser.createdAt.toISOString(),
        };
      }
    }

    if (!foundUser || !isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = createSessionToken({
      userId: foundUser._id,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: foundUser,
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
