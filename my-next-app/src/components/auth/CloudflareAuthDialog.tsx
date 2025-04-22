import { FC, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { CloudIcon, Loader2Icon, ExternalLinkIcon } from 'lucide-react';
import { storeToken } from '@/lib/tokenStorage';

interface CloudflareAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

interface CloudflareVerifyResponse {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  messages: string[];
  result: null;
}

const CloudflareAuthDialog: FC<CloudflareAuthDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!token.trim()) {
      setError('Please enter an API token');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cloudflare/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = await response.json() as CloudflareVerifyResponse;

      if (!data.success) {
        const errorMessage = data.errors?.[0]?.message || 'Invalid API token. Please check your token and try again.';
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Store token and notify parent
      storeToken(token.trim());
      onSuccess(token.trim());
      onClose();
    } catch (error) {
      console.error('Token verification error:', error);
      setError('Failed to verify token. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Connect Cloudflare Account
          </Dialog.Title>
          
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              <a
                href="https://dash.cloudflare.com/profile/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
              >
                Create API Token <ExternalLinkIcon className="w-4 h-4" />
              </a>
              {' '}&gt; Create Token<br/>
              Edit Cloudflare Workers &gt; Use Template
            </p>

            <p className="text-gray-300 text-sm">Make sure to specify short TTL for the token</p>
            
            <div className="space-y-2">
              <label htmlFor="token" className="block text-sm font-medium text-gray-300">
                API Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your API token"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-300 text-sm">
                Token is stored locally in your browser and passed to our API when needed, we don't store it and redact it from logs.
              </p>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2Icon className="w-5 h-5 animate-spin" />
              ) : (
                <CloudIcon className="w-5 h-5" />
              )}
              {isLoading ? 'Connecting...' : 'Connect Account'}
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CloudflareAuthDialog; 