/**
 * Helpers for Google OAuth flows.
 */

export function getGoogleAuthUrl(env: any): string {
  const { GOOGLE_CLIENT_ID, AUTH_BASE_URL } = env;
  if (!GOOGLE_CLIENT_ID || !AUTH_BASE_URL) {
    throw new Error('Missing Google client ID or AUTH_BASE_URL');
  }
  const redirectUri = new URL('/api/auth/google/callback', AUTH_BASE_URL).toString();
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string, env: any): Promise<any> {
  const redirectUri = new URL('/api/auth/google/callback', env.AUTH_BASE_URL).toString();
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.error_description || data.error || 'Failed to exchange code';
    throw new Error(msg);
  }
  return data;
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<any> {
  const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok || !data.email) {
    throw new Error('Failed to fetch Google user info');
  }
  return data;
}
