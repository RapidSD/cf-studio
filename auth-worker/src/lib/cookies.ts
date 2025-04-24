/** Build standardized cookie options for auth tokens */
export function cookieOptions(env: CloudflareEnv) {
  const domain = new URL(env.APP_BASE_URL).host.split(':')[0];
  return {
    httpOnly: true,
    secure: env.NEXTJS_ENV !== 'development',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
    domain,
  };
}
