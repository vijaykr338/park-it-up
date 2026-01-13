"use client";

import type { ReservationError } from '@/components/reservation/types/reservation';

export interface ErrorHandlingOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export class ReservationErrorHandler {
  private static instance: ReservationErrorHandler;

  private constructor() {}

  public static getInstance(): ReservationErrorHandler {
    if (!ReservationErrorHandler.instance) {
      ReservationErrorHandler.instance = new ReservationErrorHandler();
    }
    return ReservationErrorHandler.instance;
  }

  public handleError(
    error: ReservationError | Error | unknown,
    options: ErrorHandlingOptions = {}
  ): ReservationError {
    const {
      showToast = false,
      logError = true,
      fallbackMessage = 'An unexpected error occurred'
    } = options;

    let processedError: ReservationError;

    // Convert different error types to ReservationError
    if (this.isReservationError(error)) {
      processedError = error;
    } else if (error instanceof Error) {
      processedError = {
        message: error.message || fallbackMessage,
        code: 'UNKNOWN_ERROR'
      };
    } else {
      processedError = {
        message: fallbackMessage,
        code: 'UNKNOWN_ERROR'
      };
    }

    // Log error if enabled
    if (logError) {
      console.error('[ReservationManager] Error:', processedError);
    }

    // Show toast notification if enabled (would need toast library integration)
    if (showToast) {
      this.showErrorToast(processedError);
    }

    return processedError;
  }

  public isNetworkError(error: ReservationError): boolean {
    return error.code === 'NETWORK_ERROR' || !error.statusCode;
  }

  public isAuthError(error: ReservationError): boolean {
    return error.statusCode === 401 || error.statusCode === 403;
  }

  public isNotFoundError(error: ReservationError): boolean {
    return error.statusCode === 404 || error.code === 'BOOKING_NOT_FOUND';
  }

  public getRetryDelay(attemptCount: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attemptCount), maxDelay);
    
    // Add jitter (±25%)
    const jitter = delay * 0.25 * (Math.random() - 0.5);
    return Math.round(delay + jitter);
  }

  public shouldRetry(error: ReservationError, attemptCount: number): boolean {
    const maxRetries = 3;
    
    // Don't retry if we've exceeded max attempts
    if (attemptCount >= maxRetries) return false;
    
    // Don't retry auth or not found errors
    if (this.isAuthError(error) || this.isNotFoundError(error)) return false;
    
    // Retry network errors and server errors
    return this.isNetworkError(error) || Boolean(error.statusCode && error.statusCode >= 500);
  }

  public getUserFriendlyMessage(error: ReservationError): string {
    switch (error.code) {
      case 'BOOKING_NOT_FOUND':
        return 'This booking could not be found. Please check your booking details.';
      case 'ACCESS_DENIED':
        return 'You do not have permission to access this booking.';
      case 'NETWORK_ERROR':
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      default:
        if (error.statusCode && error.statusCode >= 500) {
          return 'Our servers are experiencing issues. Please try again in a few moments.';
        }
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  private isReservationError(error: unknown): error is ReservationError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
    );
  }

  private showErrorToast(error: ReservationError): void {
    // This would integrate with your toast notification system
    // For now, we'll just log it
    console.warn('[Toast] Error:', this.getUserFriendlyMessage(error));
  }
}

// Export singleton instance
export const errorHandler = ReservationErrorHandler.getInstance();

// Utility functions for common error handling patterns
export function withErrorHandling<T>(
  operation: () => Promise<T>,
  options?: ErrorHandlingOptions
): Promise<T> {
  return operation().catch((error) => {
    const processedError = errorHandler.handleError(error, options);
    throw processedError;
  });
}

export function createRetryWrapper<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): () => Promise<T> {
  return async (): Promise<T> => {
    let lastError: ReservationError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = errorHandler.handleError(error, { logError: attempt === maxRetries });
        
        if (attempt === maxRetries || !errorHandler.shouldRetry(lastError, attempt)) {
          throw lastError;
        }
        
        // Wait before retrying
        const delay = errorHandler.getRetryDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  };
}