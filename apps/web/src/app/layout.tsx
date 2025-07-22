import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HostItHub - Complete Vacation Rental Management Platform',
  description: 'Streamline your vacation rental business with AI-powered automation, real-time insights, and seamless guest experiences. Built by hosts, for hosts.',
  keywords: 'vacation rental management, property management, Airbnb management, VRBO management, rental automation, property management software',
  authors: [{ name: 'HostItHub Team' }],
  creator: 'HostItHub',
  publisher: 'HostItHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hostithub.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HostItHub - Complete Vacation Rental Management Platform',
    description: 'Streamline your vacation rental business with AI-powered automation, real-time insights, and seamless guest experiences.',
    url: 'https://hostithub.com',
    siteName: 'HostItHub',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HostItHub - Vacation Rental Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HostItHub - Complete Vacation Rental Management Platform',
    description: 'Streamline your vacation rental business with AI-powered automation, real-time insights, and seamless guest experiences.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
