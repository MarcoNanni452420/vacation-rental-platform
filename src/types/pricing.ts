// TypeScript interfaces for Airbnb Pricing API

export interface CurrencyAmountFormatted {
  __typename: "CurrencyAmountFormatted";
  amountFormatted: string;
  amountMicros: string;
  currency: string;
}

export interface ExplanationData {
  __typename: "QuickPayExplanationData";
  anchorLink?: string;
  anchorText?: string;
  disclaimerText?: string | null;
}

export interface DisplayPriceItem {
  __typename: "DisplayPriceItem";
  explanationData?: ExplanationData | null;
  localizedExplanation?: string | null;
  localizedSubtitle?: string | null;
  localizedTitle: string;
  nestedPriceItems: DisplayPriceItem[];
  total: CurrencyAmountFormatted;
  type: "ACCOMMODATION" | "CLEANING_FEE" | "TAXES" | "SERVICE_FEE" | "OTHER" | "PRICING_RULE_EARLY_BIRD_DISCOUNT" | "PRICING_RULE_DISCOUNT" | "DISCOUNT" | "PAY_NOW" | "TOTAL";
  supplementaryLabel?: string | null;
}

export interface QuickPayPriceBreakdown {
  __typename: "QuickPayPriceBreakdown";
  priceItems: DisplayPriceItem[];
}

export interface ProductPriceBreakdown {
  __typename: "QuickPayProductPriceBreakdown";
  priceBreakdown: QuickPayPriceBreakdown;
}

// Request interfaces
export interface GuestCounts {
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfInfants: number;
  numberOfPets: number;
}

export interface BusinessTravel {
  workTrip: boolean;
}

export interface StayCheckoutInput {
  businessTravel: BusinessTravel;
  checkinDate: string; // YYYY-MM-DD format
  checkoutDate: string; // YYYY-MM-DD format
  guestCounts: GuestCounts;
  guestCurrencyOverride: string;
  listingDetail: Record<string, unknown>;
  lux: Record<string, unknown>;
  metadata: {
    internalFlags: string[];
  };
  org: Record<string, unknown>;
  productId: string; // Base64 encoded listing ID
  addOn: {
    carbonOffsetParams: {
      isSelected: boolean;
    };
  };
  quickPayData: null;
}

export interface StayCheckoutVariables {
  input: StayCheckoutInput;
}

export interface StayCheckoutResponse {
  data: {
    stayCheckout: {
      productPriceBreakdown: ProductPriceBreakdown;
      // Add other fields as needed
    };
  };
}

// Helper types for our implementation
export interface PricingCalculation {
  accommodationTotal: number;
  accommodationPerNight: number;
  cleaningFee: number;
  taxes: number;
  serviceFeesTotal: number;
  discounts: number;
  grandTotal: number;
  nights: number;
  currency: string;
  breakdown: DisplayPriceItem[];
}

export interface PricingRequest {
  propertySlug: 'fienaroli' | 'moro';
  checkinDate: string;
  checkoutDate: string;
  guests: number;
}