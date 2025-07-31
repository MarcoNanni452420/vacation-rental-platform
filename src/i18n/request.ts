import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';
 
export default getRequestConfig(async () => {
  // This can either be defined statically if only a single locale
  // is supported, or alternatively read from the user settings,
  // a database, the `Accept-Language` header, etc.
  const locale = (await cookies()).get('locale')?.value || 'en';
  
  // Supported locales
  const supportedLocales = ['en', 'it', 'fr', 'de', 'es'];
  const validLocale = supportedLocales.includes(locale) ? locale : 'en';
 
  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});