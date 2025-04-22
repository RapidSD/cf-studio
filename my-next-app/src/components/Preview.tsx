import { FC, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

interface PreviewProps {
  url?: string;
  logs: string[];
}

const Preview: FC<PreviewProps> = ({ url = 'about:blank', logs = [] }) => {
  const [activeTab, setActiveTab] = useState('preview');

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="flex border-b border-gray-700">
          <TabsTrigger
            value="preview"
            className={`px-6 py-3 font-medium leading-relaxed ${
              activeTab === 'preview'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className={`px-6 py-3 font-medium leading-relaxed ${
              activeTab === 'logs'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 min-h-0">
          <iframe
            src={url}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts"
          />
        </TabsContent>

        <TabsContent value="logs" className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto bg-gray-900 text-gray-300 p-4 font-mono">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Preview; 