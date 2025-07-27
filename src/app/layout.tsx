import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export const metadata: Metadata = {
  title: "VacationRental Pro - Gestione Case Vacanza",
  description: "Piattaforma completa per la gestione e pubblicità di case vacanza con dashboard unificata",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  
  return (
    <html lang="it">
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
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
