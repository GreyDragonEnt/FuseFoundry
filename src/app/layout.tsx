import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import Cart from "@/components/Cart";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FuseFoundry - AI-Powered Business Transformation",
  description: "Transform your business with our fusion of AI innovation, creator-powered content, and strategic growth systems. Join 500+ businesses that have scaled with FuseFoundry.",
  keywords: "AI business transformation, creator marketing, growth systems, business consulting, artificial intelligence",
  authors: [{ name: "FuseFoundry Team" }],
  creator: "FuseFoundry",
  publisher: "FuseFoundry",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fusefoundry.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fusefoundry.dev',
    title: 'FuseFoundry - AI-Powered Business Transformation',
    description: 'Transform your business with our fusion of AI innovation, creator-powered content, and strategic growth systems.',
    siteName: 'FuseFoundry',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FuseFoundry - AI-Powered Business Transformation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FuseFoundry - AI-Powered Business Transformation',
    description: 'Transform your business with our fusion of AI innovation, creator-powered content, and strategic growth systems.',
    images: ['/og-image.png'],
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} dark`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FF6A2C" />
        <meta name="color-scheme" content="dark" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Force dark theme immediately
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                  
                  // Set localStorage
                  localStorage.setItem('fusefoundry-theme', 'dark');
                  
                } catch (e) {
                  console.log('Theme script error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body 
        className="antialiased transition-colors duration-200" 
        suppressHydrationWarning
      >
        <ThemeProvider>
          <CartProvider>
            <ServiceWorkerRegistration />
            <PWAInstallPrompt />
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
            <Cart />
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
