'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Suppress WebSocket connection errors in demo mode
    if (error.message.includes('WebSocket') || error.message.includes('Backend unavailable')) {
      console.info('Demo mode active - backend connection optional');
      return;
    }
    
    console.error('Error:', error);
  }, [error]);

  // Don't show error UI for expected demo mode errors
  if (error.message.includes('WebSocket') || error.message.includes('Backend unavailable')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="text-gray-700 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

