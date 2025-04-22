'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TabView from '@/components/TabView';
import NoticeBar from '@/components/NoticeBar';

export default function Home() {
  const [selectedService, setSelectedService] = useState<string>('');

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <NoticeBar />
      
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar onServiceSelect={setSelectedService} />
        
        <main className="flex-1 min-h-0">
          <TabView />
        </main>
      </div>
    </div>
  );
}
