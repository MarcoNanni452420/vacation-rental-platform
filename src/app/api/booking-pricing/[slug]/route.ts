import { NextRequest, NextResponse } from 'next/server';
import { 
  StayCheckoutVariables, 
  PricingCalculation, 
  DisplayPriceItem 
} from '@/types/pricing';

// Airbnb API configuration
const AIRBNB_API_BASE = 'https://www.airbnb.com/api/v3/stayCheckout';
const AIRBNB_API_KEY = 'd306zoyjsyarp7ifhu67rjxn52tv0t20';
const QUERY_HASH = '1d5d9e5bb125650782f405fde26a21a3882f1027327eb7b57ffc7adc4a05e618';

// Currency mapping by country code
const CURRENCY_MAPPING: Record<string, string> = {
  // USD countries
  'US': 'USD', 'PR': 'USD', 'EC': 'USD', 'SV': 'USD',
  'ZW': 'USD', 'TL': 'USD', 'MH': 'USD', 'PW': 'USD',
  'FM': 'USD', 'TC': 'USD', 'VI': 'USD', 'GU': 'USD',
  
  // CAD
  'CA': 'CAD',
  
  // GBP
  'GB': 'GBP', 'GI': 'GBP', 'IM': 'GBP', 
  'JE': 'GBP', 'GG': 'GBP',
  
  // CHF
  'CH': 'CHF', 'LI': 'CHF',
  
  // JPY
  'JP': 'JPY',
  
  // AUD
  'AU': 'AUD', 'CX': 'AUD', 'CC': 'AUD', 'NF': 'AUD',
  'NR': 'AUD', 'TV': 'AUD', 'KI': 'AUD',
  
  // INR
  'IN': 'INR', 'BT': 'INR',
  
  // Default EUR for all EU countries and others
};

// Determine user's currency from Vercel IP country header
function getUserCurrency(request: NextRequest): { currency: string; country: string | null } {
  const ipCountry = request.headers.get('x-vercel-ip-country');
  
  if (ipCountry && CURRENCY_MAPPING[ipCountry]) {
    return {
      currency: CURRENCY_MAPPING[ipCountry],
      country: ipCountry
    };
  }
  
  // Default to EUR if no header or country not mapped
  return {
    currency: 'EUR',
    country: ipCountry || null
  };
}

// Property mapping for productId (Base64 encoded listing IDs)
const PROPERTY_MAPPING = {
  fienaroli: {
    productId: 'U3RheUxpc3Rpbmc6MjAyNDc4MjY=', // Base64 for listing:20247826
    maxGuests: 6
  },
  moro: {
    productId: 'U3RheUxpc3Rpbmc6OTk4MzQ2MjQyMDE2NjkzMzc1', // Base64 for listing:998346242016693375  
    maxGuests: 4
  }
} as const;

function calculateNights(checkinDate: string, checkoutDate: string): number {
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);
  const diffTime = checkout.getTime() - checkin.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function parsePriceAmount(amountMicros: string): number {
  return parseInt(amountMicros) / 1000000; // Convert micros to currency units
}


function processPriceBreakdown(
  priceItems: DisplayPriceItem[], 
  nights: number,
  detectedCountry: string | null
): PricingCalculation {
  let accommodationTotal = 0;
  let cleaningFee = 0;
  let taxes = 0;
  let serviceFeesTotal = 0;
  let discounts = 0;

  for (const item of priceItems) {
    const amount = parsePriceAmount(item.total.amountMicros);
    
    switch (item.type) {
      case 'ACCOMMODATION':
        accommodationTotal = amount;
        break;
      case 'CLEANING_FEE':
        cleaningFee = amount;
        break;
      case 'TAXES':
        taxes = amount;
        break;
      case 'SERVICE_FEE':
        serviceFeesTotal += amount;
        break;
      case 'PRICING_RULE_EARLY_BIRD_DISCOUNT':
      case 'PRICING_RULE_DISCOUNT':
      case 'DISCOUNT':
        discounts += amount; // Will be negative
        break;
      default:
        // Handle other fees as service fees
        serviceFeesTotal += amount;
    }
  }

  const grandTotal = accommodationTotal + cleaningFee + taxes + serviceFeesTotal + discounts;
  const accommodationPerNight = accommodationTotal / nights;

  return {
    accommodationTotal,
    accommodationPerNight,
    cleaningFee,
    taxes,
    serviceFeesTotal,
    discounts,
    grandTotal,
    nights,
    currency: priceItems[0]?.total.currency || 'EUR', // Fallback to EUR if no items
    breakdown: priceItems,
    detectedCountry
  };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const searchParams = request.nextUrl.searchParams;
    
    const checkinDate = searchParams.get('checkinDate');
    const checkoutDate = searchParams.get('checkoutDate');
    const guests = parseInt(searchParams.get('guests') || '1');
    
    // Get user's preferred currency and detected country
    const { currency: userCurrency, country: detectedCountry } = getUserCurrency(request);

    // Validation
    if (!checkinDate || !checkoutDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: checkinDate, checkoutDate' },
        { status: 400 }
      );
    }

    if (!(slug in PROPERTY_MAPPING)) {
      return NextResponse.json(
        { error: 'Invalid property slug' },
        { status: 400 }
      );
    }

    const propertySlug = slug as keyof typeof PROPERTY_MAPPING;
    const property = PROPERTY_MAPPING[propertySlug];

    if (guests > property.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${property.maxGuests} guests allowed for this property` },
        { status: 400 }
      );
    }

    // Build Airbnb API request
    const variables: StayCheckoutVariables = {
      input: {
        businessTravel: {
          workTrip: false
        },
        checkinDate,
        checkoutDate,
        guestCounts: {
          numberOfAdults: guests,
          numberOfChildren: 0,
          numberOfInfants: 0,
          numberOfPets: 0
        },
        guestCurrencyOverride: userCurrency,
        listingDetail: {},
        lux: {},
        metadata: {
          internalFlags: ['LAUNCH_LOGIN_PHONE_AUTH']
        },
        org: {},
        productId: property.productId,
        addOn: {
          carbonOffsetParams: {
            isSelected: false
          }
        },
        quickPayData: null
      }
    };

    const extensions = {
      persistedQuery: {
        version: 1,
        sha256Hash: QUERY_HASH
      }
    };

    const params_obj = new URLSearchParams({
      operationName: 'stayCheckout',
      locale: 'it',
      currency: userCurrency,
      variables: JSON.stringify(variables),
      extensions: JSON.stringify(extensions)
    });

    const apiUrl = `${AIRBNB_API_BASE}/${QUERY_HASH}?${params_obj.toString()}`;

    // Call Airbnb API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Airbnb-Api-Key': AIRBNB_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      cache: 'no-store' // Always get fresh pricing
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch pricing from Airbnb' },
        { status: 502 }
      );
    }

    const data = await response.json();
    
    // Search for productPriceBreakdown in all possible locations
    function searchForPriceBreakdown(obj: unknown, path = ''): unknown {
      if (typeof obj !== 'object' || obj === null) return null;
      
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (key === 'productPriceBreakdown' && value && typeof value === 'object') {
          return value;
        }
        
        if (typeof value === 'object' && value !== null) {
          const result = searchForPriceBreakdown(value, currentPath);
          if (result) return result;
        }
      }
      return null;
    }
    
    const productPriceBreakdown = searchForPriceBreakdown(data);
    
    if (!productPriceBreakdown) {
      return NextResponse.json(
        { 
          error: 'Prezzi non disponibili al momento',
          message: 'I prezzi saranno visibili su Airbnb dopo aver cliccato "Prenota Ora"'
        },
        { status: 404 }
      );
    }
    
    // Try to extract priceItems from the found productPriceBreakdown
    let priceItems: DisplayPriceItem[] = [];
    
    const breakdown = productPriceBreakdown as Record<string, unknown>;
    
    if (breakdown.priceBreakdown && typeof breakdown.priceBreakdown === 'object') {
      const innerBreakdown = breakdown.priceBreakdown as Record<string, unknown>;
      if (Array.isArray(innerBreakdown.priceItems)) {
        priceItems = innerBreakdown.priceItems as DisplayPriceItem[];
      }
    } else if (Array.isArray(breakdown.priceItems)) {
      priceItems = breakdown.priceItems as DisplayPriceItem[];
    } else {
      return NextResponse.json(
        { 
          error: 'Breakdown prezzi non disponibile',
          message: 'I dettagli dei prezzi saranno visibili su Airbnb'
        },
        { status: 404 }
      );
    }
    
    if (!Array.isArray(priceItems) || priceItems.length === 0) {
      return NextResponse.json(
        { 
          error: 'Dati prezzi non validi',
          message: 'I prezzi saranno calcolati su Airbnb'
        },
        { status: 404 }
      );
    }

    // Process the real pricing data
    const nights = calculateNights(checkinDate, checkoutDate);
    const calculation = processPriceBreakdown(priceItems, nights, detectedCountry);

    return NextResponse.json(calculation);

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}