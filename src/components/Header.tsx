import React from 'react';
import { Shield } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center mb-8 bg-white w-full py-6 shadow-sm">
      <h2 className="text-lg font-medium text-blue-600 mb-4">
        Project by Vigneshwaran A (RCAS2022BCY009)
      </h2>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Shield className="w-10 h-10 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900">URL Security Analyzer</h1>
      </div>
      <p className="text-gray-600 max-w-xl mx-auto">
        Analyze URLs for potential security threats and phishing attempts.
        Enter a suspicious URL below to get started.
      </p>
    </div>
  );
}