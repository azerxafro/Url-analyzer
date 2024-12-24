import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface URLInputProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
}

export function URLInput({ onAnalyze, isAnalyzing }: URLInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to analyze..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isAnalyzing}
        />
        <button
          type="submit"
          disabled={isAnalyzing || !url.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Search size={18} />
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
    </form>
  );
}