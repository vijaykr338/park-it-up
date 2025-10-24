"use client";

import React from "react";
import CircularProgress from '@mui/material/CircularProgress';

interface PageLoaderProps {
  open: boolean;
  text?: string;
  size?: number;
}

export default function PageLoader({ open, text, size = 56 }: PageLoaderProps) {
  if (!open) return null;

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ pointerEvents: 'auto' }}
    >
      {/* translucent backdrop */}
      <div className="absolute inset-0 bg-[#0a121a]/80 backdrop-blur-sm transition-opacity" />

      <div className="relative z-10 flex flex-col items-center gap-3 p-6">
        <div className="rounded-full bg-[#0b1320]/60 p-4 shadow-lg">
          <CircularProgress size={size} thickness={4} style={{ color: '#4d84a4' }} />
        </div>
        {text && <div className="text-sm text-gray-200">{text}</div>}
      </div>
    </div>
  );
}
