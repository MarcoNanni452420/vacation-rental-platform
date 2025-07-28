import { PropertyReviewsResponse, PropertyReviewMapping } from '@/types/airbnb';

const AIRBNB_API_KEY = 'd306zoyjsyarp7ifhu67rjxn52tv0t20';
const QUERY_HASH = 'dec1c8061483e78373602047450322fd474e79ba9afa8d3dbbc27f504030f91d';

// Base URLs per diversi domini Airbnb
const AIRBNB_BASE_URLS = {
  it: 'https://www.airbnb.it/api/v3/StaysPdpReviewsQuery',
  en: 'https://www.airbnb.co.uk/api/v3/StaysPdpReviewsQuery'
};

// Mapping delle proprietà ai listing delle recensioni
export const REVIEW_PROPERTY_MAPPING: Record<string, PropertyReviewMapping> = {
  fienaroli: {
    listingId: 'U3RheUxpc3Rpbmc6MjAyNDc4MjY=',
    airbnbUrl: 'https://www.airbnb.it/rooms/20247826',
    totalReviews: 33,
    averageRating: 4.89
  },
  moro: {
    listingId: 'U3RheUxpc3Rpbmc6OTk4MzQ2MjQyMDE2NjkzMzc1',
    airbnbUrl: 'https://www.airbnb.it/rooms/998346242016693375',
    totalReviews: 24, // Basato sul limit dell'API
    averageRating: 4.95
  }
};

interface FetchAirbnbReviewsOptions {
  limit?: number;
  offset?: string;
  sortingPreference?: 'BEST_QUALITY' | 'MOST_RECENT';
}

export async function fetchPropertyReviews(
  propertySlug: string,
  options: FetchAirbnbReviewsOptions = {},
  locale: string = 'it'
): Promise<PropertyReviewsResponse> {
  const mapping = REVIEW_PROPERTY_MAPPING[propertySlug];
  
  if (!mapping) {
    throw new Error(`No review mapping found for property: ${propertySlug}`);
  }

  const {
    limit = 6,
    offset = '0',
    sortingPreference = 'BEST_QUALITY'
  } = options;

  // Costruiamo i parametri della query
  const variables = {
    id: mapping.listingId,
    pdpReviewsRequest: {
      fieldSelector: 'for_p3',
      forPreview: false,
      limit,
      offset,
      showingTranslationButton: false,
      first: limit,
      sortingPreference,
      checkinDate: '2025-12-05',
      checkoutDate: '2025-12-07',
      numberOfAdults: '2',
      numberOfChildren: '0',
      numberOfInfants: '0',
      numberOfPets: '0'
    }
  };

  const extensions = {
    persistedQuery: {
      version: 1,
      sha256Hash: QUERY_HASH
    }
  };

  const params = new URLSearchParams({
    operationName: 'StaysPdpReviewsQuery',
    locale: locale,
    currency: 'EUR',
    variables: JSON.stringify(variables),
    extensions: JSON.stringify(extensions)
  });

  // Seleziona l'URL base in base al locale
  const baseUrl = AIRBNB_BASE_URLS[locale as keyof typeof AIRBNB_BASE_URLS] || AIRBNB_BASE_URLS.it;
  const url = `${baseUrl}/${QUERY_HASH}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Airbnb-Api-Key': AIRBNB_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      cache: 'no-store' // Evita caching per ottenere sempre dati freschi
    });

    if (!response.ok) {
      throw new Error(`Airbnb API error: ${response.status} ${response.statusText}`);
    }

    const data: PropertyReviewsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property reviews:', error);
    throw error;
  }
}

export function getPropertyReviewUrl(propertySlug: string): string {
  const mapping = REVIEW_PROPERTY_MAPPING[propertySlug];
  return mapping?.airbnbUrl || '#';
}

export function getPropertyReviewStats(propertySlug: string) {
  const mapping = REVIEW_PROPERTY_MAPPING[propertySlug];
  if (!mapping) return null;
  
  return {
    totalReviews: mapping.totalReviews || 0,
    averageRating: mapping.averageRating || 0,
    url: mapping.airbnbUrl
  };
}