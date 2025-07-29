interface CachedTranslation {
  originalText: string;
  translatedText: string;
  targetLang: 'it' | 'en';
  createdAt: number;
  reviewId: string;
}

const CACHE_KEY = 'review_translations';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 giorni

export function getCachedTranslation(reviewId: string, targetLang: 'it' | 'en'): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}_${reviewId}_${targetLang}`);
    if (!cached) return null;
    
    const translation: CachedTranslation = JSON.parse(cached);
    
    // Check if expired
    if (Date.now() - translation.createdAt > CACHE_EXPIRY) {
      localStorage.removeItem(`${CACHE_KEY}_${reviewId}_${targetLang}`);
      return null;
    }
    
    return translation.translatedText;
  } catch {
    return null;
  }
}

export function setCachedTranslation(
  reviewId: string, 
  originalText: string, 
  translatedText: string, 
  targetLang: 'it' | 'en'
): void {
  if (typeof window === 'undefined') return;
  
  const translation: CachedTranslation = {
    originalText,
    translatedText,
    targetLang,
    createdAt: Date.now(),
    reviewId
  };
  
  try {
    localStorage.setItem(
      `${CACHE_KEY}_${reviewId}_${targetLang}`, 
      JSON.stringify(translation)
    );
  } catch {
    // Storage full, ignore
  }
}

// Utilities per gestione cache
export function clearTranslationCache(): void {
  if (typeof window === 'undefined') return;
  
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(CACHE_KEY)) {
      localStorage.removeItem(key);
    }
  });
}

export function getCacheStats(): { count: number; size: number } {
  if (typeof window === 'undefined') return { count: 0, size: 0 };
  
  let count = 0;
  let size = 0;
  
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(CACHE_KEY)) {
      count++;
      size += localStorage.getItem(key)?.length || 0;
    }
  });
  
  return { count, size };
}