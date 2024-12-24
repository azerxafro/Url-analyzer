import React from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { AnalysisResult, SecurityCheck } from '../types';

interface AnalysisResultsProps {
  result: AnalysisResult | null;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  if (!result) return null;

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return <ShieldAlert className="w-8 h-8 text-red-500" />;
      case 'Medium':
        return <Shield className="w-8 h-8 text-yellow-500" />;
      default:
        return <ShieldCheck className="w-8 h-8 text-green-500" />;
    }
  };

  const getStatusColor = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mt-8">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b">
        {getRiskIcon(result.riskLevel)}
        <div>
          <h2 className="text-2xl font-bold">Risk Level: {result.riskLevel}</h2>
          <p className="text-gray-600">Score: {result.riskScore}/100</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Security Checks</h3>
        {result.checks.map((check, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getStatusColor(check.status)}`}
          >
            <h4 className="font-medium">{check.name}</h4>
            <p className="text-sm mt-1">{check.details}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t text-sm text-gray-500">
        Analysis performed at: {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>
  );
}