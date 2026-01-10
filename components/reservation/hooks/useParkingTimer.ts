"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ParkingTimer, BookingStatus } from '@/components/reservation/types/reservation';

export interface UseParkingTimerOptions {
  startTime: string | null;
  hourlyRate: number;
  status: BookingStatus;
  enabled?: boolean;
  debugTimeOffset?: number; // Debug: Add minutes to elapsed time
}

export interface UseParkingTimerReturn {
  timer: ParkingTimer | null;
  isRunning: boolean;
  formattedDuration: string;
  currentCost: number;
}

export function useParkingTimer({
  startTime,
  hourlyRate,
  status,
  enabled = true,
  debugTimeOffset = 0
}: UseParkingTimerOptions): UseParkingTimerReturn {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Calculate timer values
  const calculateTimer = useCallback((): ParkingTimer | null => {
    if (!startTime || !enabled) return null;

    const start = new Date(startTime);
    const now = currentTime;
    const elapsedMs = Math.max(0, now.getTime() - start.getTime());
    
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    let elapsedMinutes = Math.floor(elapsedSeconds / 60);
    
    // Add debug time offset (in minutes)
    elapsedMinutes += debugTimeOffset;
    
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    
    // Format duration as "Xh Ym"
    const hours = Math.floor(elapsedMinutes / 60);
    const minutes = elapsedMinutes % 60;
    const formattedDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    
    // Calculate current cost based on elapsed time (ensure positive)
    const currentCost = Math.max(0, Math.round((elapsedMinutes / 60) * hourlyRate * 100) / 100);

    return {
      startTime: start,
      currentTime: now,
      elapsedSeconds: elapsedSeconds + (debugTimeOffset * 60),
      elapsedMinutes,
      elapsedHours,
      formattedDuration,
      currentCost,
      hourlyRate
    };
  }, [startTime, currentTime, hourlyRate, enabled, debugTimeOffset]);

  const timer = calculateTimer();
  const isRunning = status === 'checked_in' && enabled && !!startTime;

  // Update timer every second when running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Pause timer when tab is not visible (performance optimization)
  useEffect(() => {
    if (!isRunning) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Update time immediately when tab becomes visible
        setCurrentTime(new Date());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning]);

  return {
    timer,
    isRunning,
    formattedDuration: timer?.formattedDuration || '0m',
    currentCost: timer?.currentCost || 0
  };
}