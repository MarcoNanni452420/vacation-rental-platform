import {getRequestConfig} from 'next-intl/server';
import {cookies, headers} from 'next/headers';
 
export default getRequestConfig(async () => {
  // Supported locales
  const supportedLocales = ['en', 'it', 'fr', 'de', 'es'];
  
  // Priority 1: Check if user has manually selected a language (cookie)
  const cookieLocale = (await cookies()).get('locale')?.value;
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return {
      locale: cookieLocale,
      messages: (await import(`../messages/${cookieLocale}.json`)).default
    };
  }
  
  // Priority 2: Auto-detect from browser Accept-Language header
  const acceptLanguage = (await headers()).get('accept-language') || '';
  
  // Parse Accept-Language header (e.g., "it-IT,it;q=0.9,en;q=0.8,fr;q=0.7")
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, priority] = lang.trim().split(';q=');
      return {
        code: code.split('-')[0].toLowerCase(), // Extract language code (it-IT → it)
        priority: priority ? parseFloat(priority) : 1.0
      };
    })
    .sort((a, b) => b.priority - a.priority); // Sort by priority
  
  // Find first supported language
  for (const lang of languages) {
    if (supportedLocales.includes(lang.code)) {
      return {
        locale: lang.code,
        messages: (await import(`../messages/${lang.code}.json`)).default
      };
    }
  }
  
  // Priority 3: Fallback to English
  return {
    locale: 'en',
    messages: (await import(`../messages/en.json`)).default
  };
});