import React, { useState } from 'react';
import { URLInput } from './components/URLInput';
import { AnalysisResults } from './components/AnalysisResults';
import { Header } from './components/Header';
import { ErrorMessage } from './components/ErrorMessage';
import { analyzeURLAPI } from './utils/api';
import type { AnalysisResult } from './types';

// Change to default export
export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysisResult = await analyzeURLAPI(url);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <Header />
      <div className="w-full max-w-2xl px-4 py-8">
        <URLInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        <ErrorMessage message={error} />
        <AnalysisResults result={result} />
      </div>
    </div>
  );
}