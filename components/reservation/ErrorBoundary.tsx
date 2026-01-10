"use client";

import React, { Component, ReactNode } from 'react';
import { errorHandler } from '@/components/reservation/utils/errorHandling';
import type { ReservationError } from '@/components/reservation/types/reservation';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: ReservationError, retry: () => void) => ReactNode;
  onError?: (error: ReservationError) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: ReservationError | null;
}

export class ReservationErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const processedError = errorHandler.handleError(error, { logError: true });
    return {
      hasError: true,
      error: processedError
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const processedError = errorHandler.handleError(error, { logError: true });
    this.props.onError?.(processedError);
    
    // Log additional error info in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ReservationErrorBoundary] Error Info:', errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <DefaultErrorFallback 
          error={this.state.error} 
          onRetry={this.handleRetry} 
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: ReservationError;
  onRetry: () => void;
}

function DefaultErrorFallback({ error, onRetry }: DefaultErrorFallbackProps) {
  const userMessage = errorHandler.getUserFriendlyMessage(error);
  const isNetworkError = errorHandler.isNetworkError(error);

  return (
    <div className="min-h-screen bg-[#0a121a] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-red-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-400 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-300 text-sm mb-4">
              {userMessage}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="w-full rounded-lg bg-[#4d84a4] px-4 py-2 font-semibold hover:brightness-110 transition-all"
            >
              Try Again
            </button>
            
            {isNetworkError && (
              <button
                onClick={() => window.location.reload()}
                className="w-full rounded-lg border border-[#4d84a4]/25 px-4 py-2 font-semibold hover:bg-[#4d84a4]/10 transition-all"
              >
                Refresh Page
              </button>
            )}

            <a
              href="/user-bookings"
              className="block w-full rounded-lg border border-gray-500/25 px-4 py-2 font-semibold hover:bg-gray-500/10 transition-all"
            >
              Go to My Bookings
            </a>
          </div>

          {process.env.NODE_ENV === 'development' && error.code && (
            <div className="mt-4 p-3 rounded bg-gray-800/50 text-xs text-gray-400">
              <div>Error Code: {error.code}</div>
              {error.statusCode && <div>Status: {error.statusCode}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}