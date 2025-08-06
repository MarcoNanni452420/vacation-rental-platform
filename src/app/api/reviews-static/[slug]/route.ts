import { NextRequest, NextResponse } from 'next/server';
import { ReviewApiError } from '@/types/airbnb';
import fs from 'fs';
import path from 'path';

// Supported locales and properties
const SUPPORTED_LOCALES = ['en', 'it', 'fr', 'de', 'es'];
const SUPPORTED_PROPERTIES = ['fienaroli', 'moro'];

// Cache per i dati statici (in memoria per performance)
interface StaticReviewsData {
  metadata: {
    createdAt: string;
    source: string;
    languages: string[];
    properties: string[];
  };
  reviews: Record<string, Record<string, {
    reviews: unknown[];
    totalCount: number;
    airbnbUrl: string;
    fetchedAt: string;
  }>>;
}

let staticDataCache: StaticReviewsData | null = null;
let cacheLastModified: number = 0;

/**
 * Carica i dati statici dal file
 */
function loadStaticReviews(): StaticReviewsData {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/static-reviews.json');
    
    // Check if file exists
    if (!fs.existsSync(dataPath)) {
      console.warn('⚠️ Static reviews file not found, falling back to empty data');
      return {
        metadata: {
          createdAt: new Date().toISOString(),
          source: 'fallback-empty',
          languages: SUPPORTED_LOCALES,
          properties: SUPPORTED_PROPERTIES
        },
        reviews: {}
      };
    }
    
    // Check if we need to reload (file changed)
    const stats = fs.statSync(dataPath);
    const fileModified = stats.mtimeMs;
    
    if (!staticDataCache || fileModified > cacheLastModified) {
      console.log('📖 Loading static reviews data...');
      const rawData = fs.readFileSync(dataPath, 'utf8');
      staticDataCache = JSON.parse(rawData);
      cacheLastModified = fileModified;
      
      console.log(`✅ Loaded static reviews: ${Object.keys(staticDataCache.reviews || {}).length} properties`);
    }
    
    return staticDataCache;
    
  } catch (error) {
    console.error('❌ Error loading static reviews:', error);
    throw new Error('Failed to load static reviews data');
  }
}

/**
 * Valida i parametri della richiesta
 */
function validateRequest(slug: string, locale: string) {
  if (!SUPPORTED_PROPERTIES.includes(slug)) {
    throw new Error(`Property '${slug}' not found. Supported: ${SUPPORTED_PROPERTIES.join(', ')}`);
  }
  
  const validLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'en';
  return { validSlug: slug, validLocale };
}

/**
 * Formatta la risposta per mantenere compatibilità con il vecchio API
 */
interface PropertyData {
  reviews: unknown[];
  totalCount?: number;
  airbnbUrl?: string;
  fetchedAt?: string;
}

function formatResponse(propertyData: PropertyData | undefined, slug: string, _locale: string) { // eslint-disable-line @typescript-eslint/no-unused-vars
  if (!propertyData) {
    return {
      reviews: [],
      totalCount: 0,
      propertySlug: slug,
      airbnbUrl: getAirbnbUrl(slug),
      fetchedAt: new Date().toISOString(),
      source: 'static-fallback'
    };
  }
  
  return {
    reviews: propertyData.reviews || [],
    totalCount: propertyData.totalCount || propertyData.reviews?.length || 0,
    propertySlug: slug,
    airbnbUrl: propertyData.airbnbUrl || getAirbnbUrl(slug),
    fetchedAt: propertyData.fetchedAt || new Date().toISOString(),
    source: 'static-data'
  };
}

/**
 * Fallback URLs Airbnb
 */
function getAirbnbUrl(slug: string): string {
  const urls = {
    'fienaroli': 'https://www.airbnb.com/rooms/20247826',
    'moro': 'https://www.airbnb.com/rooms/998346242016693375'
  };
  return urls[slug as keyof typeof urls] || '';
}

/**
 * GET endpoint - Restituisce recensioni statiche
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Ottieni parametri query
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';
    const limit = parseInt(searchParams.get('limit') || '12');
    
    // Valida richiesta
    const { validSlug, validLocale } = validateRequest(slug, locale);
    
    // Carica dati statici
    const staticData = loadStaticReviews();
    
    // Ottieni dati per proprietà e lingua
    const propertyData = staticData.reviews?.[validSlug]?.[validLocale];
    
    if (!propertyData) {
      console.warn(`⚠️ No static data found for ${validSlug}/${validLocale}`);
    }
    
    // Applica limit se specificato
    const responseData = formatResponse(propertyData, validSlug, validLocale);
    
    if (limit && responseData.reviews.length > limit) {
      responseData.reviews = responseData.reviews.slice(0, limit);
      responseData.totalCount = responseData.reviews.length;
    }
    
    // Headers per cache (dato che i dati sono statici)
    const response = NextResponse.json(responseData);
    
    // Cache for 1 hour since data is static
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    response.headers.set('X-Data-Source', 'static-reviews');
    
    return response;
    
  } catch (error) {
    console.error('❌ Static reviews API error:', error);
    
    const errorResponse: ReviewApiError = {
      error: 'Failed to fetch static reviews',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * POST endpoint - Trigger reload dei dati statici (per admin)
 */
export async function POST(
  _request: NextRequest, // eslint-disable-line @typescript-eslint/no-unused-vars
  _params: { params: Promise<{ slug: string }> } // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  try {
    // Clear cache to force reload
    staticDataCache = null;
    cacheLastModified = 0;
    
    // Reload data
    const staticData = loadStaticReviews();
    
    return NextResponse.json({
      message: 'Static reviews cache cleared and reloaded',
      success: true,
      metadata: staticData.metadata
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to reload static reviews', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}