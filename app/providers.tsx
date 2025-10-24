'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Number of retry attempts on failure
        retry: 2,
        
        // Don't refetch when user returns to browser tab
        refetchOnWindowFocus: false,
        
        // ✅ v5: Data considered fresh for 10 seconds
        staleTime: 10 * 1000, // 10 seconds
        
        // ✅ v5: gcTime (was cacheTime in v4)
        // Keep unused data in memory for 5 minutes before garbage collection
        gcTime: 5 * 60 * 1000, // 5 minutes
        
        // Automatically poll/refetch every 30 seconds
        refetchInterval: 30 * 1000, // 30 seconds
        
        // Refetch on component mount if data is stale
        refetchOnMount: 'always',
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
