import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider, ServiceWorkerProvider } from '@/components/providers';
import { NotificationTrigger } from '@/components/features/NotificationTrigger';
import { PinLockOverlay } from '@/components/features/PinLockOverlay';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Life OS – Persönliches Lebens-Management',
  description: 'Dein privates, offline-fähiges System für Ziele, Aufgaben, Gewohnheiten und Reflexion.',
  keywords: ['productivity', 'goals', 'habits', 'tasks', 'reflection', 'life management'],
  authors: [{ name: 'Kutay Kurt' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Life OS',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9fc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ServiceWorkerProvider>
            <PinLockOverlay />
            <NotificationTrigger />
            {children}
          </ServiceWorkerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

