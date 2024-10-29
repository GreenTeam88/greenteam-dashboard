// src/layout.tsx
'use client';

import './globals.css';

import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import CustomModal from '@/components/custom/CustomModal';
import QueryProvider from '@/providers/QueryProvider';
import { SessionProvider } from '@/providers/SessionProvider';

export const dynamic = 'force-dynamic';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { auth: React.ReactNode; children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomModal />
        <QueryProvider>
          <SessionProvider>{children}</SessionProvider>
        </QueryProvider>
        <Toaster duration={2500} richColors={true} />
      </body>
    </html>
  );
}
