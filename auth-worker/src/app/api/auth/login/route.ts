import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { AuthDB } from '@/lib/db';
import { sendMagicLink } from '@/lib/resend';

const loginSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext();
    
    // Directly destructure, assuming CloudflareEnv type is correct
    const { DB, RESEND_API_KEY, RESEND_EMAIL_FROM, JWT_SECRET } = env;

    // Check if values are actually present at runtime (optional but safer)
    if (!DB || !RESEND_API_KEY || !RESEND_EMAIL_FROM || !JWT_SECRET) {
      console.error('Missing required environment variables at runtime');
      throw new Error('Missing required environment variables');
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const authDB = new AuthDB(DB);

    // Get or create user
    let user = await authDB.getUserByEmail(email);
    if (!user) {
      user = await authDB.createUser(email);
    }

    // Generate verification token
    const tokenData = await authDB.createVerificationToken(user.id, 'email_verification');

    // Send magic link via helper
    const verifyUrl = new URL('/verify', request.url);
    verifyUrl.searchParams.set('token', tokenData.token);
    try {
      await sendMagicLink(
        email,
        verifyUrl.toString(),
        RESEND_API_KEY,
        RESEND_EMAIL_FROM
      );
    } catch (error) {
      console.error('Resend send failed:', error);
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Check your email for the magic link',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to process login request' },
      { status: 500 }
    );
  }
}