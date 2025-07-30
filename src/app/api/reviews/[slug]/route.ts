import { NextRequest, NextResponse } from 'next/server';
import { fetchPropertyReviews, REVIEW_PROPERTY_MAPPING } from '@/lib/reviews-api';
import { ReviewApiError } from '@/types/airbnb';
import { translateHostResponses } from '@/lib/translate-host-responses';
import { translateReview } from '@/lib/openai-translation';
import { cleanReviewerLocation, cleanCollectionTag } from '@/lib/clean-platform-references';

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
      return NextResponse.json(cached.data);
    }

    // Fetch dalle API delle recensioni
    const reviewsData = await fetchPropertyReviews(slug, {
      limit,
      offset,
      sortingPreference
    }, locale);

    // Estrai le recensioni dal response
    const reviews = reviewsData.data?.presentation?.stayProductDetailPage?.reviews?.reviews || [];
    
    // Prepara la risposta pulita - Airbnb già fornisce i commenti in inglese
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
        location: cleanReviewerLocation(review.localizedReviewerLocation),
        pictureUrl: review.reviewer.pictureUrl,
        isSuperhost: review.reviewer.isSuperhost
      },
      response: review.response || null,
      collectionTag: cleanCollectionTag(review.collectionTag),
      needsTranslation: locale === 'it', // Solo IT locale necessita traduzione
      disclaimer: '' // Sarà impostato dopo le traduzioni
    }));

    // Gestione traduzioni basate su locale
    if (locale === 'it') {
      // Per locale IT: traduci sia reviews che host responses in italiano
      const reviewsToTranslate = cleanedReviews
        .filter(review => review.comments && review.comments.trim().length > 0)
        .map(review => ({
          id: review.id,
          text: review.comments
        }));

      const hostResponsesToTranslate = cleanedReviews
        .filter(review => review.response && review.response.trim().length > 0)
        .map(review => ({
          id: review.id,
          response: review.response!
        }));

      // Traduci reviews in batch sequenziali per evitare rate limiting OpenAI
      if (reviewsToTranslate.length > 0) {
        const BATCH_SIZE = 3; // Batch più piccolo per evitare overload API
        const reviewTranslationMap = new Map();
        
        // Process reviews in sequential batches
        for (let i = 0; i < reviewsToTranslate.length; i += BATCH_SIZE) {
          const batch = reviewsToTranslate.slice(i, i + BATCH_SIZE);
          
          const batchResults = await Promise.all(
            batch.map(async ({ id, text }) => ({
              id,
              translatedText: await translateReview({ text, targetLang: 'it' })
            }))
          );
          
          // Add batch results to map
          batchResults.forEach(({ id, translatedText }) => {
            reviewTranslationMap.set(id, translatedText);
          });
          
          // Small delay between batches to respect rate limits
          if (i + BATCH_SIZE < reviewsToTranslate.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        // Aggiorna i comments con le traduzioni
        cleanedReviews = cleanedReviews.map(review => ({
          ...review,
          comments: reviewTranslationMap.get(review.id) || review.comments
        }));
      }

      // Traduci host responses
      if (hostResponsesToTranslate.length > 0) {
        const translatedResponses = await translateHostResponses(hostResponsesToTranslate, 'it');
        
        const responseTranslationMap = new Map(
          translatedResponses.map(tr => [tr.reviewId, tr.translatedResponse])
        );
        
        cleanedReviews = cleanedReviews.map(review => ({
          ...review,
          response: responseTranslationMap.get(review.id) || review.response
        }));
      }

      // Imposta disclaimer per IT
      cleanedReviews = cleanedReviews.map(review => ({
        ...review,
        disclaimer: 'Tradotto automaticamente'
      }));

    } else if (locale === 'en') {
      // Per locale EN: traduci solo host responses (reviews già in inglese)
      const hostResponsesToTranslate = cleanedReviews
        .filter(review => review.response && review.response.trim().length > 0)
        .map(review => ({
          id: review.id,
          response: review.response!
        }));

      if (hostResponsesToTranslate.length > 0) {
        const translatedResponses = await translateHostResponses(hostResponsesToTranslate, 'en');
        
        const translationMap = new Map(
          translatedResponses.map(tr => [tr.reviewId, tr.translatedResponse])
        );
        
        cleanedReviews = cleanedReviews.map(review => ({
          ...review,
          response: translationMap.get(review.id) || review.response
        }));
      }

      // Nessun disclaimer per EN (reviews native, host responses tradotte in background)
      cleanedReviews = cleanedReviews.map(review => ({
        ...review,
        disclaimer: ''
      }));

    } else {
      // Altri locali: mantenere logica precedente
      const hostResponsesToTranslate = cleanedReviews
        .filter(review => review.response && review.response.trim().length > 0)
        .map(review => ({
          id: review.id,
          response: review.response!
        }));

      if (hostResponsesToTranslate.length > 0) {
        const translatedResponses = await translateHostResponses(hostResponsesToTranslate, locale);
        
        const translationMap = new Map(
          translatedResponses.map(tr => [tr.reviewId, tr.translatedResponse])
        );
        
        cleanedReviews = cleanedReviews.map(review => ({
          ...review,
          response: translationMap.get(review.id) || review.response
        }));
      }

      // Disclaimer generico per altri locali
      cleanedReviews = cleanedReviews.map(review => ({
        ...review,
        disclaimer: 'Automatically translated'
      }));
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