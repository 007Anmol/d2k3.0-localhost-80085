// src/components/providers/Providers.tsx
'use client';

import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#27272a',
              color: '#e5e7eb',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}