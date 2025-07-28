export interface ReviewData {
  id: string;
  comments: string;
  originalComments?: string;
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
  response?: string | null;
  collectionTag?: string | null;
  needsTranslation?: boolean;
  disclaimer?: string;
}

export interface ReviewsResponse {
  reviews: ReviewData[];
  totalCount: number;
  propertySlug: string;
  airbnbUrl: string;
  fetchedAt: string;
}