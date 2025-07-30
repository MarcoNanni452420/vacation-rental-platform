import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getLocale} from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import { headers } from 'next/headers';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://trastevere-luxury.com'),
  title: "Trastevere Luxury | Authentic Rome, Refined Living",
  description: "Stay in exclusive designer apartments featuring 15th-century wooden ceilings and contemporary glass walls. Two unique properties in Rome's most charming neighborhood, steps from Santa Maria in Trastevere and major attractions.",
  keywords: ["luxury vacation rental Trastevere", "15th century ceiling Rome", "designer apartment Rome", "exposed beams Rome", "Casa Fienaroli", "Casa Moro", "Santa Maria Trastevere rental", "Via dei Fienaroli apartment", "Rome glass walls apartment", "Trastevere luxury accommodation", "authentic Rome accommodation"],
  authors: [{ name: "Trastevere Luxury" }],
  creator: "Trastevere Luxury",
  publisher: "Trastevere Luxury",
  openGraph: {
    title: "Trastevere Luxury | Authentic Rome, Refined Living",
    description: "Stay in exclusive designer apartments featuring 15th-century wooden ceilings and contemporary glass walls. Two unique properties in Rome's most charming neighborhood.",
    siteName: "Trastevere Luxury",
    images: [
      {
        url: "/images/fienaroli/bedroom-elegant.jpg",
        width: 1200,
        height: 630,
        alt: "Trastevere Luxury - Casa Fienaroli Designer Bedroom with Exposed Beams",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trastevere Luxury | Authentic Rome, Refined Living",
    description: "Stay in exclusive designer apartments featuring 15th-century wooden ceilings and contemporary glass walls in Rome's most charming neighborhood.",
    images: ["/images/fienaroli/bedroom-elegant.jpg"],
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
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logo-tl.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/logo-tl.png',
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
  
  // Get nonce from middleware
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';
  
  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://a0.muscache.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preload" as="fetch" href="/api/availability/fienaroli" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/api/availability/moro" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17411939860"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17411939860');
          `}
        </Script>
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
