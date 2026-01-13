"use client";

import { useEffect, useRef, useState } from 'react';

export interface UsePollingLifecycleOptions {
  enabled?: boolean;
  pauseOnHidden?: boolean;
  onVisibilityChange?: (isVisible: boolean) => void;
}

export interface UsePollingLifecycleReturn {
  isVisible: boolean;
  shouldPoll: boolean;
  pausePolling: () => void;
  resumePolling: () => void;
}

/**
 * Hook to manage polling lifecycle with tab visibility detection
 * Automatically pauses polling when tab is not visible for performance optimization
 */
export function usePollingLifecycle({
  enabled = true,
  pauseOnHidden = true,
  onVisibilityChange
}: UsePollingLifecycleOptions = {}): UsePollingLifecycleReturn {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    // Check initial visibility state
    if (typeof document !== 'undefined') {
      return document.visibilityState === 'visible';
    }
    return true;
  });
  
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const visibilityCallbackRef = useRef(onVisibilityChange);

  // Update callback ref
  useEffect(() => {
    visibilityCallbackRef.current = onVisibilityChange;
  }, [onVisibilityChange]);

  // Handle visibility change
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsVisible(visible);
      visibilityCallbackRef.current?.(visible);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Set initial state
    handleVisibilityChange();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Calculate if polling should be active
  const shouldPoll = enabled && !manuallyPaused && (pauseOnHidden ? isVisible : true);

  const pausePolling = () => setManuallyPaused(true);
  const resumePolling = () => setManuallyPaused(false);

  return {
    isVisible,
    shouldPoll,
    pausePolling,
    resumePolling
  };
}

/**
 * Hook for managing cleanup of intervals and timeouts
 */
export function useCleanupManager() {
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const addTimeout = (timeout: NodeJS.Timeout) => {
    timeoutsRef.current.add(timeout);
    return timeout;
  };

  const addInterval = (interval: NodeJS.Timeout) => {
    intervalsRef.current.add(interval);
    return interval;
  };

  const clearTimeout = (timeout: NodeJS.Timeout) => {
    global.clearTimeout(timeout);
    timeoutsRef.current.delete(timeout);
  };

  const clearInterval = (interval: NodeJS.Timeout) => {
    global.clearInterval(interval);
    intervalsRef.current.delete(interval);
  };

  const clearAll = () => {
    // Clear all timeouts
    timeoutsRef.current.forEach(timeout => {
      global.clearTimeout(timeout);
    });
    timeoutsRef.current.clear();

    // Clear all intervals
    intervalsRef.current.forEach(interval => {
      global.clearInterval(interval);
    });
    intervalsRef.current.clear();
  };

  // Cleanup on unmount
  useEffect(() => {
    return clearAll;
  }, []);

  return {
    addTimeout,
    addInterval,
    clearTimeout,
    clearInterval,
    clearAll
  };
}