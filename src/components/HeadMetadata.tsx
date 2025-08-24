"use client"

import Head from 'next/head'

interface HeadMetadataProps {
  heroImageUrl: string;
  propertyName: string;
}

export function HeadMetadata({ heroImageUrl, propertyName }: HeadMetadataProps) {
  // Next.js image optimization URL
  const optimizedImageUrl = `/_next/image?url=${encodeURIComponent(heroImageUrl)}&w=1920&q=75`;
  
  return (
    <Head>
      {/* Preload hero image for better LCP */}
      <link
        rel="preload"
        as="image"
        href={optimizedImageUrl}
        type="image/avif"
        fetchPriority="high"
      />
      {/* Also preload webp fallback */}
      <link
        rel="preload"
        as="image"
        href={`/_next/image?url=${encodeURIComponent(heroImageUrl)}&w=1920&q=75`}
        type="image/webp"
      />
    </Head>
  );
}