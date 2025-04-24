'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface VerifyResponse {
  success?: boolean;
  // refresh_token removed (cookie-only)
  error?: string;
}

export default function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerifyResponse>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus({ error: 'No verification token provided' });
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await res.json() as VerifyResponse;
        setStatus(data);

        if (data.success) {
          // Cookie-only flow: redirect to home (cookies carry tokens)
          router.push('/');
        }
      } catch {
        setStatus({ error: 'Failed to verify token' });
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, router]);

  if (isLoading) {
    return <div>Verifying...</div>;
  }

  if (status.error) {
    return <div className="text-red-600">{status.error}</div>;
  }

  if (status.success) {
    return <div>Verification successful! Redirecting...</div>;
  }

  return null;
} 