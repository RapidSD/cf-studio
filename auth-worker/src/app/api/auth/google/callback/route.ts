import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { exchangeCodeForToken, fetchGoogleUserInfo } from '@/lib/google';
import { AuthDB } from '@/lib/db';
import { cookieOptions } from '@/lib/cookies';
import { createJwt } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext();
    const { DB, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } = env;
    if (!DB || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !JWT_SECRET) {
      throw new Error('Missing required environment variables for Google OAuth');
    }

    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }

    // Exchange code for token and fetch user info
    const tokenData = await exchangeCodeForToken(code, env);
    const accessToken = tokenData.access_token;
    const userInfo = await fetchGoogleUserInfo(accessToken);

    const email = userInfo.email as string;
    const db = new AuthDB(DB);
    let user = await db.getUserByEmail(email);
    if (!user) {
      user = await db.createUser(email);
    }
    // mark email as verified
    await db.verifyEmail(user.id);

    // create session
    const session = await db.createSession(user.id);

    // sign jwt
    const jwt = await createJwt(
      { sub: user.id, email: user.email, sessionId: session.id },
      env.JWT_SECRET
    );

    // set refresh token cookie and redirect to dashboard
    const response = NextResponse.redirect(new URL('/', env.APP_BASE_URL));
    const options = cookieOptions(env);
    response.cookies.set({ name: 'refresh_token', value: session.refresh_token, ...options });
    response.cookies.set({ name: 'access_token', value: jwt, ...options });
    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Server error' });
  }
}
