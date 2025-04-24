export const runtime = 'edge';
import { cookies } from 'next/headers';
import HomeClient from './page.client';
import NoticeBar from '@/components/NoticeBar';
import Link from 'next/link';

export default async function Home() {
  const cookieStore = await cookies();
  const refreshCookie = cookieStore.get('refresh_token');
  if (!refreshCookie) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white p-6">
        <NoticeBar />
        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
          <h1 className="text-3xl font-bold">Welcome to Cloudflare Studio</h1>
          <div className="flex space-x-4">
            <Link href="/about">
              <button className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">About</button>
            </Link>
            <a href="https://auth.cloudflare.studio/login">
              <button className="px-4 py-2 bg-green-500 rounded hover:bg-green-600">Login</button>
            </a>
          </div>
        </div>
      </div>
    );
  }
  return <HomeClient />;
}
