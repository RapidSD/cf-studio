import { FC, ReactNode, useState } from 'react';
import { MessageSquareIcon, EyeIcon, ListIcon, BookOpenIcon } from 'lucide-react';
import Chat, { Message } from './Chat';
import Preview from './Preview';
import SourcesList from './SourcesList';

interface TabViewProps {
  className?: string;
  selectedService: string;
}

type Tab = {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
};

// Interface for RAG API response
interface RagResponse {
  answer: string;
  context: Array<{
    content: string;
    source: string;
    score: number;
  }>;
  search_query: string;
}

const TabView: FC<TabViewProps> = ({ className = '', selectedService }) => {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [logs, setLogs] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<Array<{
    content: string;
    source: string;
    score: number;
  }>>([]);

  const handleSendMessage = async (message: string) => {
    try {
      // Call our RAG API
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json() as RagResponse;
      
      // Add AI response to messages
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: data.answer }
      ]);
      
      // Store retrieved sources
      if (data.context && data.context.length > 0) {
        setSources(data.context);
      }
      
      // Add to logs for viewing in logs tab
      setLogs(prev => [
        ...prev, 
        `User: ${message}`, 
        `AI: ${data.answer}`,
        `Search query: ${data.search_query || message}`
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Sorry, I encountered an error while processing your request.' }
      ]);
      setLogs(prev => [...prev, `Error: Failed to process message`]);
    }
  };

  const tabs: Tab[] = [
    {
      id: 'chat',
      label: 'Chat',
      icon: <MessageSquareIcon className="w-5 h-5" />,
      content: (
        <div className="flex flex-col flex-1 min-h-0">
          <Chat 
            onSendMessage={handleSendMessage} 
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      )
    },
    {
      id: 'preview',
      label: 'Preview',
      icon: <EyeIcon className="w-5 h-5" />,
      content: <Preview logs={logs} url="about:blank" />
    },
    {
      id: 'sources',
      label: 'Sources',
      icon: <BookOpenIcon className="w-5 h-5" />,
      content: (
        <div className="flex flex-col flex-1 min-h-0 overflow-auto bg-gray-900">
          <SourcesList sources={sources} />
        </div>
      )
    },
    {
      id: 'logs',
      label: 'Logs',
      icon: <ListIcon className="w-5 h-5" />,
      content: (
        <div className="flex flex-col flex-1 p-4 space-y-2 overflow-auto">
          {selectedService ? (
            logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="text-sm text-gray-300">
                  {log}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center flex-1 text-sm text-gray-500">
                No logs available for {selectedService}
              </div>
            )
          ) : (
            <div className="flex items-center justify-center flex-1 text-sm text-gray-500">
              Select a service to view logs
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 min-h-0">
        <div className="flex-1 min-h-0 border-r border-gray-800">
          <Chat onSendMessage={handleSendMessage} messages={messages} setMessages={setMessages} />
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