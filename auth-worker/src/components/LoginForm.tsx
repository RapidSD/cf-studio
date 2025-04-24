'use client';

import { useState } from 'react';
import * as Label from '@radix-ui/react-label';

interface LoginResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<LoginResponse>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({});

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json() as LoginResponse;
      // Handle HTTP and API-level errors
      if (!res.ok || data.success === false) {
        setStatus({ error: data.error || 'Failed to send magic link' });
      } else {
        setStatus({ message: data.message || 'Check your email for the magic link' });
      }
    } catch {
      setStatus({ error: 'Failed to send magic link' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label.Root htmlFor="email" className="text-sm font-medium text-gray-700">
          Email address
        </Label.Root>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors duration-200"
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Sending...' : 'Send Magic Link'}
      </button>

      <div className="flex items-center justify-center my-4">
        <span className="text-gray-500">or</span>
      </div>
      <button
        type="button"
        disabled={isLoading}
        onClick={() => { setIsLoading(true); window.location.href = '/api/auth/google'; }}
        className="w-full py-3 px-4 rounded-lg font-medium text-gray-800 bg-white border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Redirecting...' : 'Continue with Google'}
      </button>

      {status.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5">
          {status.error}
        </p>
      )}
      {status.message && (
        <p className="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2.5">
          {status.message}
        </p>
      )}
    </form>
  );
} 