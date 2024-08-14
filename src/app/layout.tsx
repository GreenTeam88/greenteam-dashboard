import './globals.css';

import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import CustomModal from '@/components/custom/CustomModal';


const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { auth: React.ReactNode; children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomModal />
        {children}
        <Toaster duration={2500} />
      </body>
    </html>
  );
}
