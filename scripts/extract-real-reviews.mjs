#!/usr/bin/env node

/**
 * Script avanzato di estrazione recensioni REALI
 * Usa il sistema API esistente per estrarre dati live da Airbnb
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurazione
const API_BASE = 'http://localhost:3000';
const OUTPUT_FILE = 'real-reviews-extracted.json';
const LOCALES = ['en', 'it']; // Prima estraiamo EN e IT, poi traduciamo gli altri

/**
 * Fetch recensioni reali via API locale
 */
async function fetchRealReviews(propertySlug, locale = 'en', limit = 12) {
  const url = `${API_BASE}/api/reviews/${propertySlug}?limit=${limit}&locale=${locale}`;
  
  console.log(`🔄 Fetching ${propertySlug} reviews (${locale})...`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Got ${data.reviews?.length || 0} reviews for ${propertySlug} (${locale})`);
    
    return data;
    
  } catch (error) {
    console.error(`❌ Failed to fetch ${propertySlug} (${locale}):`, error.message);
    return null;
  }
}

/**
 * Estrae tutte le recensioni per tutte le proprietà e lingue
 */
async function extractAllRealReviews() {
  console.log('🚀 Starting REAL reviews extraction...\n');
  
  const extractedData = {
    metadata: {
      extractedAt: new Date().toISOString(),
      source: 'live-airbnb-api',
      totalProperties: 2,
      locales: LOCALES
    },
    data: {}
  };
  
  const properties = ['fienaroli', 'moro'];
  
  for (const propertySlug of properties) {
    console.log(`\n🏠 Processing ${propertySlug.toUpperCase()}:`);
    extractedData.data[propertySlug] = {};
    
    for (const locale of LOCALES) {
      const reviewsData = await fetchRealReviews(propertySlug, locale, 12);
      
      if (reviewsData) {
        extractedData.data[propertySlug][locale] = reviewsData;
        
        const reviewCount = reviewsData.reviews?.length || 0;
        const responseCount = reviewsData.reviews?.filter(r => r.response)?.length || 0;
        
        console.log(`   ${locale.toUpperCase()}: ${reviewCount} reviews, ${responseCount} host responses`);
      } else {
        extractedData.data[propertySlug][locale] = null;
        console.log(`   ${locale.toUpperCase()}: ❌ FAILED`);
      }
      
      // Small delay to be gentle with the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return extractedData;
}

/**
 * Analizza i dati estratti e genera statistiche
 */
function analyzeExtractedData(data) {
  console.log('\n📊 EXTRACTION ANALYSIS:');
  console.log('========================');
  
  let totalReviews = 0;
  let totalResponses = 0;
  let byProperty = {};
  
  Object.keys(data.data).forEach(property => {
    byProperty[property] = { reviews: 0, responses: 0 };
    
    Object.keys(data.data[property]).forEach(locale => {
      const localeData = data.data[property][locale];
      if (localeData && localeData.reviews) {
        const reviews = localeData.reviews.length;
        const responses = localeData.reviews.filter(r => r.response).length;
        
        byProperty[property].reviews += reviews;
        byProperty[property].responses += responses;
        totalReviews += reviews;
        totalResponses += responses;
      }
    });
  });
  
  console.log(`📝 Total Reviews: ${totalReviews}`);
  console.log(`💬 Total Host Responses: ${totalResponses}`);
  console.log(`🏠 Properties: ${Object.keys(byProperty).length}`);
  console.log(`🌍 Locales: ${data.metadata.locales.join(', ')}`);
  
  console.log('\n🏠 By Property:');
  Object.keys(byProperty).forEach(prop => {
    console.log(`   ${prop}: ${byProperty[prop].reviews} reviews, ${byProperty[prop].responses} responses`);
  });
  
  return {
    totalReviews,
    totalResponses,
    byProperty
  };
}

/**
 * Salva i dati estratti
 */
function saveExtractedData(data, filename = OUTPUT_FILE) {
  const outputPath = path.join(__dirname, filename);
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
    
    const stats = fs.statSync(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    console.log(`\n💾 Data saved to: ${outputPath}`);
    console.log(`📦 File size: ${sizeKB} KB`);
    
    return outputPath;
    
  } catch (error) {
    console.error('❌ Error saving data:', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🏛️  TRASTEVERE LUXURY - Real Reviews Extraction');
  console.log('================================================\n');
  
  try {
    // Check if local server is running
    console.log('🔍 Checking local server...');
    const healthCheck = await fetch(`${API_BASE}/api/reviews/fienaroli?limit=1`);
    if (!healthCheck.ok) {
      throw new Error('Local server not responding. Please run: npm run dev');
    }
    console.log('✅ Local server is running\n');
    
    // Extract all reviews
    const extractedData = await extractAllRealReviews();
    
    // Analyze data
    const analysis = analyzeExtractedData(extractedData);
    
    // Save data
    const outputPath = saveExtractedData(extractedData);
    
    console.log('\n🎉 EXTRACTION COMPLETED SUCCESSFULLY!');
    console.log('\n📋 Next Steps:');
    console.log('1. Review the extracted data file');
    console.log('2. Run translation script for FR/DE/ES');
    console.log('3. Create static data structure');
    console.log('4. Migrate API to use static data');
    
    console.log(`\n📄 Output file: ${path.basename(outputPath)}`);
    
  } catch (error) {
    console.error('\n💥 EXTRACTION FAILED:', error.message);
    console.error('\nTroubleshooting:');
    console.error('- Make sure local dev server is running: npm run dev');
    console.error('- Check if the API endpoints are working');
    console.error('- Verify your Airbnb API keys are set up');
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main().catch(console.error);
}