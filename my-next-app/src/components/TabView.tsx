import { FC, ReactNode, useState } from 'react';
import { MessageSquareIcon, EyeIcon, ListIcon } from 'lucide-react';
import Chat from './Chat';
import Preview from './Preview';

interface TabViewProps {
  className?: string;
}

type Tab = {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
};

const TabView: FC<TabViewProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [logs, setLogs] = useState<string[]>([]);

  const handleSendMessage = async (message: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json() as { response: string };
      setLogs(prev => [...prev, `AI: ${data.response}`]);
    } catch (error) {
      console.error('Error:', error);
      setLogs(prev => [...prev, `Error: Failed to process message`]);
    }
  };

  const tabs: Tab[] = [
    {
      id: 'chat',
      label: 'Chat',
      icon: <MessageSquareIcon className="w-5 h-5" />,
      content: <Chat onSendMessage={handleSendMessage} />
    },
    {
      id: 'preview',
      label: 'Preview',
      icon: <EyeIcon className="w-5 h-5" />,
      content: <Preview logs={logs} url="about:blank" />
    },
    {
      id: 'logs',
      label: 'Logs',
      icon: <ListIcon className="w-5 h-5" />,
      content: (
        <div className="p-4 space-y-2 text-sm text-gray-400">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 min-h-0">
        <div className="flex-1 min-h-0 border-r border-gray-800">
          <Chat onSendMessage={handleSendMessage} />
        </div>
        <div className="flex-1 min-h-0">
          <Preview logs={logs} url="about:blank" />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col h-full md:hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex items-center justify-around border-t border-gray-800 bg-gray-900 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 px-5 transition-colors
                ${activeTab === tab.id 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'}`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabView; 