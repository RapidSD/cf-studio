import { NextRequest, NextResponse } from 'next/server';
import { AuthDB } from '@/lib/db';
import { z } from 'zod';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cookieOptions } from '@/lib/cookies';
import { createJwt } from '@/lib/jwt';

const verifySchema = z.object({
  token: z.string()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = verifySchema.parse(body);
    
    const { env } = await getCloudflareContext();
    
    if (!env?.DB || !env?.JWT_SECRET) {
      throw new Error('Missing required environment variables');
    }

    const db = new AuthDB(env.DB);
    
    // Verify token and get user
    const verificationToken = await db.getVerificationToken(token, 'email_verification');
    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - verificationToken.created_at * 1000;
    if (tokenAge > 24 * 60 * 60 * 1000) {
      await db.deleteVerificationToken(verificationToken.id);
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    const user = await db.getUserById(verificationToken.user_id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Mark email as verified
    await db.verifyEmail(user.id);

    // Create session
    const session = await db.createSession(user.id);

    // Create JWT (24h expiration)
    const jwt = await createJwt(
      { sub: user.id, email: user.email, sessionId: session.id },
      env.JWT_SECRET
    );

    // Delete used token
    await db.deleteVerificationToken(verificationToken.id);

    // Cookie-only auth: set tokens
    const response = NextResponse.json({ success: true });
    const options = cookieOptions(env);
    response.cookies.set({ name: 'refresh_token', value: session.refresh_token, ...options });
    response.cookies.set({ name: 'access_token',  value: jwt,                 ...options });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }
    
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 