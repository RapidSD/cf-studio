import { FC } from 'react';

interface Source {
  content: string;
  source: string;
  score: number;
}

interface SourcesListProps {
  sources: Source[];
}

const SourcesList: FC<SourcesListProps> = ({ sources }) => {
  if (sources.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No sources available
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-medium text-white">Sources</h3>
      <div className="space-y-3">
        {sources.map((source, index) => (
          <div 
            key={index} 
            className="bg-gray-800 rounded-lg p-3 border border-gray-700"
          >
            <div className="text-sm text-gray-300 mb-2">{source.content}</div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">
                {source.source.replace(/^docs\//, '')}
              </span>
              <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full">
                Score: {(source.score * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourcesList; 