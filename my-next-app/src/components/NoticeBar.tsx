'use client';

import { FC, useEffect, useState } from 'react';
import { AlertTriangleIcon, XIcon } from 'lucide-react';
import Link from 'next/link';

const NOTICE_DISMISSED_KEY = 'notice-dismissed';

const NoticeBar: FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isDismissed = localStorage.getItem(NOTICE_DISMISSED_KEY);
    if (isDismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(NOTICE_DISMISSED_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-amber-500 text-black w-full px-2 sm:px-4 py-2 flex flex-wrap items-center justify-between text-sm font-medium sticky top-0 z-50">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <AlertTriangleIcon className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">
          This is an unofficial experimental project and is not affiliated with or endorsed by Cloudflare
        </span>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <Link 
          href="/about" 
          className="bg-black/10 hover:bg-black/20 px-3 py-1 rounded-full transition-colors flex-shrink-0 text-sm"
        >
          Learn more
        </Link>
        <button
          onClick={handleDismiss}
          className="p-2 hover:bg-black/10 rounded-full transition-colors flex-shrink-0"
          aria-label="Dismiss notice"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NoticeBar; 