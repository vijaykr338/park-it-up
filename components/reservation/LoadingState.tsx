"use client";

import React from 'react';

interface LoadingStateProps {
  message?: string;
  showSkeleton?: boolean;
  onRefresh?: () => void;
}

export function ReservationLoadingState({ 
  message = "Loading your reservation...", 
  showSkeleton = true,
  onRefresh
}: LoadingStateProps) {
  if (!showSkeleton) {
    return (
      <div className="min-h-screen bg-[#0a121a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4d84a4] mx-auto mb-4"></div>
          <p className="text-gray-300 mb-4">{message}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 rounded-lg border border-[#4d84a4]/25 bg-[#232834]/60 hover:bg-[#232834]/80 transition-all text-sm"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-root min-h-screen bg-[#0a121a] text-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:py-10">
        {/* Header Skeleton */}
        <header className="mb-6 md:mb-8 space-y-4">
          <div className="h-10 bg-gray-700/50 rounded-lg animate-pulse w-80"></div>
          <div className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-2">
              <div className="h-3 bg-gray-600/50 rounded w-24 animate-pulse"></div>
              <div className="h-6 bg-gray-600/50 rounded w-32 animate-pulse"></div>
            </div>
            <div className="hidden sm:block h-10 w-px bg-[#4d84a4]/20" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-600/50 rounded w-32 animate-pulse"></div>
              <div className="h-6 bg-gray-600/50 rounded w-48 animate-pulse"></div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Status Card Skeleton */}
          <section className="lg:col-span-2 rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-5">
            <div className="mb-6 space-y-2">
              <div className="h-8 bg-gray-600/50 rounded w-64 animate-pulse"></div>
              <div className="h-4 bg-gray-600/50 rounded w-80 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Status Display Skeleton */}
              <div className="rounded-lg border border-dashed border-[#4d84a4]/40 p-4 flex flex-col items-center justify-center">
                <div className="w-48 h-48 bg-gray-600/30 rounded animate-pulse mb-3"></div>
                <div className="h-4 bg-gray-600/50 rounded w-32 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-600/50 rounded w-24 animate-pulse"></div>
              </div>

              {/* Timer and Actions Skeleton */}
              <div className="space-y-4">
                <div className="h-12 bg-gray-600/50 rounded-lg animate-pulse"></div>
                <div className="rounded-lg border border-[#4d84a4]/20 bg-[#0b1320]/40 p-4 text-center">
                  <div className="h-3 bg-gray-600/50 rounded w-20 mx-auto animate-pulse mb-2"></div>
                  <div className="h-12 bg-gray-600/50 rounded w-32 mx-auto animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-600/50 rounded w-28 mx-auto animate-pulse"></div>
                </div>
                <div className="rounded-lg border border-[#4d84a4]/20 bg-[#0b1320]/40 p-3">
                  <div className="h-4 bg-gray-600/50 rounded w-32 animate-pulse mb-2"></div>
                  <div className="space-y-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-3 bg-gray-600/50 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar Skeleton */}
          <aside className="space-y-4">
            {/* Booking Information Skeleton */}
            <section className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
              <div className="h-5 bg-gray-600/50 rounded w-40 animate-pulse mb-3"></div>
              <div className="grid grid-cols-1 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-lg border border-[#4d84a4]/20 bg-[#0b1320]/40 p-3">
                    <div className="h-3 bg-gray-600/50 rounded w-16 animate-pulse mb-1"></div>
                    <div className="h-4 bg-gray-600/50 rounded w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Live Billing Skeleton */}
            <section className="rounded-xl border border-[#4d84a4]/25 bg-[#232834]/50 p-4">
              <div className="h-5 bg-gray-600/50 rounded w-24 animate-pulse mb-3"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-600/50 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-600/50 rounded w-16 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {/* Loading indicator */}
        <div className="fixed bottom-4 right-4 bg-[#232834] border border-[#4d84a4]/25 rounded-lg p-3 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4d84a4]"></div>
          <span className="text-sm text-gray-300">{message}</span>
        </div>
      </div>
    </div>
  );
}

// Compact loading component for smaller areas
export function CompactLoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4d84a4] mx-auto mb-2"></div>
        <p className="text-sm text-gray-300">{message}</p>
      </div>
    </div>
  );
}