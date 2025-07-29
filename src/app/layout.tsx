import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getLocale} from 'next-intl/server';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL('https://trastevere-luxury.com'),
  title: "Historic Luxury Apartments Trastevere Rome | 15th Century Ceilings & Designer Glass Walls",
  description: "Stay in exclusive designer apartments with 15th-century wooden ceilings and contemporary glass walls in Trastevere, Rome. Casa Fienaroli on Via dei Fienaroli and Casa Moro near Santa Maria - authentic luxury experiences.",
  keywords: ["historic apartment Rome", "luxury vacation rental Trastevere", "15th century ceiling Rome", "designer apartment Rome", "exposed beams Rome", "Casa Fienaroli", "Casa Moro", "Santa Maria Trastevere rental", "Via dei Fienaroli apartment", "Rome glass walls apartment", "Trastevere luxury accommodation", "historic Rome vacation rental"],
  authors: [{ name: "Trastevere Luxury Homes" }],
  creator: "Trastevere Luxury Homes",
  publisher: "Trastevere Luxury Homes",
  openGraph: {
    title: "Historic Luxury Apartments Trastevere Rome | Casa Fienaroli & Casa Moro",
    description: "Stay in exclusive designer apartments with 15th-century wooden ceilings and contemporary glass walls in Trastevere, Rome. Authentic luxury experiences near Santa Maria.",
    siteName: "Trastevere Luxury Homes",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Trastevere Luxury Homes - Casa Fienaroli and Casa Moro",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Historic Luxury Apartments Trastevere Rome | Casa Fienaroli & Casa Moro",
    description: "Stay in exclusive designer apartments with 15th-century wooden ceilings and contemporary glass walls in Trastevere, Rome.",
    images: ["/og-image.jpg"],
    creator: "@trastevereluxury",
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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  verification: {
    google: '',
    other: {},
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();
  
  return (
    <html lang={locale}>
      <head>
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//maps.googleapis.com" />
        <link rel="dns-prefetch" href="//a0.muscache.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
