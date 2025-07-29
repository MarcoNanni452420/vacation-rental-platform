/**
 * Utility functions to clean platform references from API response data
 */

import { ReviewData } from '@/types/reviews'

/**
 * Clean platform-specific references from text
 * @param text - Text to clean
 * @returns Cleaned text without platform references
 */
export function cleanPlatformReferences(text: string | null | undefined): string {
  if (!text) return '';
  
  // Remove explicit Airbnb mentions
  let cleaned = text.replace(/\bAirbnb\b/gi, '').trim();
  
  // Clean up any double spaces left after removal
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

/**
 * Clean reviewer location data to remove tenure info
 * @param location - Location text that may include tenure
 * @returns Only the geographical location
 */
export function cleanReviewerLocation(location: string | null | undefined): string {
  if (!location) return '';
  
  // Patterns to remove (case insensitive)
  const tenurePatterns = [
    /\d+\s*years?\s+on\s+Airbnb/gi,
    /Airbnb\s+member\s+since\s+\d{4}/gi,
    /Member\s+since\s+\d{4}/gi,
    /\d+\s*anni?\s+su\s+Airbnb/gi, // Italian
    /Membro\s+dal\s+\d{4}/gi, // Italian
    /·\s*\d+\s*years?\s+hosting/gi,
    /·\s*\d+\s*anni?\s+come\s+host/gi, // Italian
  ];
  
  let cleaned = location;
  
  // Remove all tenure patterns
  tenurePatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '').trim();
  });
  
  // Remove leading/trailing separators (·, -, |, etc.)
  cleaned = cleaned.replace(/^[·\-|,\s]+|[·\-|,\s]+$/g, '').trim();
  
  // If nothing left after cleaning, return empty string
  if (!cleaned || cleaned.length < 2) return '';
  
  return cleaned;
}

/**
 * Clean collection tag to remove platform references
 * @param tag - Collection tag text
 * @returns Cleaned tag or null if it should be removed
 */
export function cleanCollectionTag(tag: string | null | undefined): string | null {
  if (!tag) return null;
  
  // If tag contains platform references, return null to hide it
  const platformKeywords = /airbnb|superhost|host|verified/i;
  if (platformKeywords.test(tag)) {
    return null;
  }
  
  // Otherwise return the tag as-is
  return tag;
}

/**
 * Clean all review data to remove platform references
 * @param review - Review object from API
 * @returns Cleaned review object
 */
export function cleanReviewData(review: ReviewData): ReviewData {
  return {
    ...review,
    // Clean reviewer location
    reviewer: {
      ...review.reviewer,
      location: cleanReviewerLocation(review.reviewer?.location || '')
    },
    // Clean collection tag
    collectionTag: cleanCollectionTag(review.collectionTag),
    // Clean any other text fields that might contain references
    comments: cleanPlatformReferences(review.comments),
    response: review.response ? cleanPlatformReferences(review.response) : null
  };
}