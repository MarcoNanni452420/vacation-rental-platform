export interface ReviewUser {
  id: string;
  firstName: string;
  hostName: string;
  pictureUrl: string;
  profilePath: string;
  isSuperhost: boolean;
}

export interface LocalizedReview {
  comments: string;
  commentsLanguage: string;
  disclaimer?: string;
  needsTranslation: boolean;
  response?: string | null;
  responseDisclaimer?: string | null;
}

export interface PropertyReview {
  id: string;
  comments: string;
  language: string;
  createdAt: string;
  rating: number;
  localizedDate: string;
  localizedReviewerLocation: string;
  reviewer: ReviewUser;
  reviewee: ReviewUser;
  localizedReview: LocalizedReview;
  response?: string | null;
  collectionTag?: string | null;
}

export interface PropertyReviewsResponse {
  data: {
    presentation: {
      stayProductDetailPage: {
        reviews: {
          reviews: PropertyReview[];
          totalCount?: number;
        };
      };
    };
  };
}

export interface PropertyReviewMapping {
  listingId: string;
  airbnbUrl: string;
  totalReviews?: number;
  averageRating?: number;
}

export interface ReviewApiError {
  error: string;
  message: string;
  status: number;
}

// Legacy aliases for backward compatibility
export type AirbnbUser = ReviewUser;
export type AirbnbReview = PropertyReview;
export type AirbnbReviewsResponse = PropertyReviewsResponse;
export type PropertyAirbnbMapping = PropertyReviewMapping;
export type AirbnbApiError = ReviewApiError;