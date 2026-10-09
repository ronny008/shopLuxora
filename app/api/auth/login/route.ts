import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/models/User';
import { verifyPassword, createSessionToken, setAuthCookie } from '@/lib/auth';
import { validateEmail, validatePassword } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Connect to MongoDB database
    await dbConnect();

    // 2. Query user from MongoDB by email (explicitly selecting password)
    const dbUser = await UserModel.findOne({ email: cleanEmail }).select('+password');

    if (!dbUser) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 3. Verify hashed password against database record
    if (!dbUser.password || !verifyPassword(password, dbUser.password)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 4. Verify account status
    if (dbUser.status === 'suspended') {
      return NextResponse.json(
        { error: 'This account has been suspended. Please contact support.' },
        { status: 403 }
      );
    }

    // 5. Construct user session object from database record
    const authenticatedUser = {
      _id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role as 'Customer' | 'Admin' | 'Guest',
      status: dbUser.status,
      createdAt: dbUser.createdAt ? dbUser.createdAt.toISOString() : new Date().toISOString(),
    };

    // 6. Generate signed JWT session token with real database role
    const token = createSessionToken({
      userId: authenticatedUser._id,
      email: authenticatedUser.email,
      name: authenticatedUser.name,
      role: authenticatedUser.role,
    });

    // 7. Store auth cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: authenticatedUser,
    });
  } catch (error: unknown) {
    console.error('Login API error:', error);
    const message = error instanceof Error ? error.message : 'Database login error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
