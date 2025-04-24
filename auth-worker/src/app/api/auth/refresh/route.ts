import { NextRequest, NextResponse } from 'next/server';
import { AuthDB } from '@/lib/db';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cookieOptions } from '@/lib/cookies';
import { createJwt } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext();
    
    if (!env?.DB || !env?.JWT_SECRET) {
      throw new Error('Missing required environment variables');
    }

    const db = new AuthDB(env.DB);
    
    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refresh_token')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }

    // Get session
    const session = await db.getSessionByRefreshToken(refreshToken);
    if (!session) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    // Check if session is expired (30 days)
    const sessionAge = Date.now() - session.created_at * 1000;
    if (sessionAge > 30 * 24 * 60 * 60 * 1000) {
      await db.deleteSession(session.id);
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // Get user
    const user = await db.getUserById(session.user_id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create new JWT (24h expiration)
    const jwt = await createJwt(
      { sub: user.id, email: user.email, sessionId: session.id },
      env.JWT_SECRET
    );

    // Cookie-only auth: set access_token cookie
    const response = NextResponse.json({ success: true });
    const options = cookieOptions(env);
    response.cookies.set({ name: 'access_token', value: jwt, ...options });
    return response;
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 