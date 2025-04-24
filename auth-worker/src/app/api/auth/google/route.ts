import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getGoogleAuthUrl } from '@/lib/google';

export async function GET() {
  const { env } = await getCloudflareContext();
  const url = getGoogleAuthUrl(env);
  return NextResponse.redirect(url);
}
