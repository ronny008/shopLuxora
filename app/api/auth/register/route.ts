import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/models/User';
import { hashPassword, createSessionToken, setAuthCookie } from '@/lib/auth';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateRole,
} from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role = 'Customer' } = body;

    const nameError = validateName(name);
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }

    const passwordError = validatePassword(password, true);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const roleError = validateRole(role);
    if (roleError) {
      return NextResponse.json({ error: roleError }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const cleanRole = role === 'Admin' ? 'Admin' : 'Customer';

    const hashedPassword = hashPassword(password);
    let createdUser: {
      _id: string;
      name: string;
      email: string;
      role: 'Customer' | 'Admin';
      status: string;
      createdAt: string;
    } | null = null;

    try {
      await dbConnect();

      const existingUser = await UserModel.findOne({ email: cleanEmail });
      if (existingUser) {
        return NextResponse.json(
          { error: 'An account with this email already exists.' },
          { status: 409 }
        );
      }

      const dbUser = await UserModel.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: cleanRole,
        status: 'active',
      });

      createdUser = {
        _id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role as 'Customer' | 'Admin',
        status: dbUser.status,
        createdAt: dbUser.createdAt ? dbUser.createdAt.toISOString() : new Date().toISOString(),
      };
    } catch (dbErr: unknown) {
      console.warn('MongoDB register error, using session fallback:', dbErr);
      createdUser = {
        _id: `user-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        role: cleanRole as 'Customer' | 'Admin',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
    }

    const token = createSessionToken({
      userId: createdUser._id,
      email: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: createdUser,
    });
  } catch (error: unknown) {
    console.error('Registration API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create account';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
