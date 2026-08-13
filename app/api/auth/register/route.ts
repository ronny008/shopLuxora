import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/models/User';
import { hashPassword, createSessionToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role = 'Customer' } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    await dbConnect();

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const createdUser = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: ['Admin', 'Customer'].includes(role) ? role : 'Customer',
      status: 'active',
    });

    const newUserObj = {
      _id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      status: createdUser.status,
      createdAt: createdUser.createdAt.toISOString(),
    };

    const token = createSessionToken({
      userId: newUserObj._id,
      email: newUserObj.email,
      name: newUserObj.name,
      role: newUserObj.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: newUserObj,
    });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}
