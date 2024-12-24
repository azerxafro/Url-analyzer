import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {message}
    </div>
  );
}