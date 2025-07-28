import { NextRequest, NextResponse } from 'next/server';
import { fetchPropertyReviews, REVIEW_PROPERTY_MAPPING } from '@/lib/airbnb-api';
import { ReviewApiError } from '@/types/airbnb';
import { translateHostResponses } from '@/lib/translate-host-responses';

// Cache delle recensioni (1 ora)
const CACHE_DURATION = 60 * 60 * 1000; // 1 ora in millisecondi

interface CleanedReview {
  id: string;
  comments: string;
  originalComments: string;
  language: string;
  createdAt: string;
  localizedDate: string;
  rating: number;
  reviewer: {
    firstName: string;
    location: string;
    pictureUrl: string;
    isSuperhost: boolean;
  };
  response: string | null;
  collectionTag: string | null;
  needsTranslation: boolean;
  disclaimer: string;
}

interface ReviewsResponse {
  reviews: CleanedReview[];
  totalCount: number;
  propertySlug: string;
  airbnbUrl: string;
  fetchedAt: string;
}

const reviewsCache = new Map<string, { data: ReviewsResponse; timestamp: number }>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Verifica che la proprietà esista
    if (!REVIEW_PROPERTY_MAPPING[slug]) {
      return NextResponse.json(
        { error: 'Property not found', message: `No review mapping for property: ${slug}` } as ReviewApiError,
        { status: 404 }
      );
    }

    // Ottieni parametri dalla query string
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '6');
    const offset = searchParams.get('offset') || '0';
    const sortingPreference = searchParams.get('sorting') as 'BEST_QUALITY' | 'MOST_RECENT' || 'BEST_QUALITY';
    const locale = searchParams.get('locale') || 'it'; // Lingua locale dell'utente

    // Controlla la cache
    const cacheKey = `reviews_${slug}_${locale}`;
    const cached = reviewsCache.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`Serving cached reviews for ${slug} (${locale})`);
      return NextResponse.json(cached.data);
    }

    console.log(`Fetching property reviews for ${slug} (limit: ${limit}, offset: ${offset}, locale: ${locale})`);

    // Fetch dalle API delle recensioni
    const reviewsData = await fetchPropertyReviews(slug, {
      limit,
      offset,
      sortingPreference
    }, locale);

    // Estrai le recensioni dal response
    const reviews = reviewsData.data?.presentation?.stayProductDetailPage?.reviews?.reviews || [];
    
    // Prepara la risposta pulita - Airbnb già fornisce le traduzioni native per i commenti
    let cleanedReviews = reviews.map(review => ({
      id: review.id,
      comments: review.comments,
      originalComments: review.comments || '',
      language: review.language,
      createdAt: review.createdAt,
      localizedDate: review.localizedDate,
      rating: review.rating,
      reviewer: {
        firstName: review.reviewer.firstName,
        location: review.localizedReviewerLocation,
        pictureUrl: review.reviewer.pictureUrl,
        isSuperhost: review.reviewer.isSuperhost
      },
      response: review.response || null,
      collectionTag: review.collectionTag || null,
      needsTranslation: false,
      disclaimer: locale !== 'it' ? `Native translation by Airbnb for ${locale.toUpperCase()}` : ''
    }));

    // Traduci le host responses se necessario (solo per locale diverso da italiano)
    if (locale !== 'it') {
      // Estrai le responses che necessitano traduzione
      const hostResponsesToTranslate = cleanedReviews
        .filter(review => review.response && review.response.trim().length > 0)
        .map(review => ({
          id: review.id,
          response: review.response!
        }));

      if (hostResponsesToTranslate.length > 0) {
        console.log(`🔄 Translating ${hostResponsesToTranslate.length} host responses to ${locale}`);
        
        const translatedResponses = await translateHostResponses(hostResponsesToTranslate, locale);
        
        // Crea una mappa per lookup veloce
        const translationMap = new Map(
          translatedResponses.map(tr => [tr.reviewId, tr.translatedResponse])
        );
        
        // Aggiorna le reviews con le traduzioni
        cleanedReviews = cleanedReviews.map(review => ({
          ...review,
          response: translationMap.get(review.id) || review.response
        }));
      }
    }

    const responseData = {
      reviews: cleanedReviews,
      totalCount: cleanedReviews.length,
      propertySlug: slug,
      airbnbUrl: REVIEW_PROPERTY_MAPPING[slug].airbnbUrl,
      fetchedAt: new Date().toISOString()
    };

    // Salva in cache
    reviewsCache.set(cacheKey, {
      data: responseData,
      timestamp: now
    });
    
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error in property-reviews API:', error);
    
    const errorResponse: ReviewApiError = {
      error: 'Failed to fetch reviews',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Endpoint per pulire la cache (utile per development)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Pulisci tutte le cache per questo slug (tutte le lingue)
    const keysToDelete = Array.from(reviewsCache.keys()).filter(key => key.startsWith(`reviews_${slug}_`));
    let deletedCount = 0;
    
    keysToDelete.forEach(key => {
      reviewsCache.delete(key);
      deletedCount++;
    });
    
    return NextResponse.json({ 
      message: `Cache cleared for ${slug} (${deletedCount} entries)`,
      success: true 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear cache', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}