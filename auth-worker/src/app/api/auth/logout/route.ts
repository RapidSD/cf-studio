import { NextRequest, NextResponse } from 'next/server';
import { AuthDB } from '@/lib/db';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cookieOptions } from '@/lib/cookies';

export async function POST(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext();
    
    if (!env?.DB) {
      throw new Error('Missing required environment variables');
    }

    const db = new AuthDB(env.DB);
    
    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refresh_token')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }

    // Get and delete session
    const session = await db.getSessionByRefreshToken(refreshToken);
    if (session) {
      await db.deleteSession(session.id);
    }

    // Clear both auth cookies
    const response = NextResponse.json({ success: true });
    const options = cookieOptions(env);
    response.cookies.set({ name: 'refresh_token', value: '', expires: new Date(0), ...options });
    response.cookies.set({ name: 'access_token',  value: '', expires: new Date(0), ...options });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 