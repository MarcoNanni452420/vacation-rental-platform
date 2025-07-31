#!/usr/bin/env node

/**
 * Creates sample static reviews data for testing the migration
 * Uses extracted data and creates placeholder translations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const INPUT_FILE = 'real-reviews-extracted.json';
const OUTPUT_FILE = 'static-reviews-complete.json';
const TARGET_LANGUAGES = ['fr', 'de', 'es'];

/**
 * Create placeholder translation
 */
function createPlaceholderTranslation(text, targetLang, type = 'review') {
  const prefixes = {
    'fr': type === 'review' ? '[FR] ' : '[FR Host] ',
    'de': type === 'review' ? '[DE] ' : '[DE Host] ',
    'es': type === 'review' ? '[ES] ' : '[ES Host] '
  };
  
  return prefixes[targetLang] + text;
}

/**
 * Get disclaimer for language
 */
function getDisclaimer(lang) {
  const disclaimers = {
    'fr': 'Traduit automatiquement',
    'de': 'Automatisch übersetzt', 
    'es': 'Traducido automáticamente'
  };
  return disclaimers[lang] || '';
}

/**
 * Create translated version of review
 */
function translateReview(review, targetLang) {
  return {
    ...review,
    comments: createPlaceholderTranslation(review.comments, targetLang, 'review'),
    response: review.response ? createPlaceholderTranslation(review.response, targetLang, 'response') : null,
    originalComments: review.comments,
    originalResponse: review.response,
    needsTranslation: true, // Mark as placeholder
    disclaimer: getDisclaimer(targetLang)
  };
}

/**
 * Main execution
 */
async function main() {
  console.log('🏛️  TRASTEVERE LUXURY - Sample Static Data Creation');
  console.log('==================================================\n');
  
  try {
    // Load extracted data
    const inputPath = path.join(__dirname, INPUT_FILE);
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${INPUT_FILE}. Run extract-real-reviews.mjs first.`);
    }
    
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const extractedData = JSON.parse(rawData);
    
    console.log('📖 Loaded extracted reviews data');
    
    // Create static data structure
    const staticData = {
      metadata: {
        createdAt: new Date().toISOString(),
        source: 'sample-placeholder',
        languages: ['en', 'it', ...TARGET_LANGUAGES],
        properties: Object.keys(extractedData.data),
        note: 'Contains placeholder translations for testing. Run full translation for production.'
      },
      reviews: {}
    };
    
    // Process each property
    for (const propertySlug of Object.keys(extractedData.data)) {
      console.log(`\n🏠 Processing ${propertySlug.toUpperCase()}:`);
      
      staticData.reviews[propertySlug] = {};
      const propertyData = extractedData.data[propertySlug];
      
      // Copy existing EN and IT data
      if (propertyData.en) {
        staticData.reviews[propertySlug].en = propertyData.en;
        console.log(`   ✅ EN: ${propertyData.en.reviews.length} reviews (original)`);
      }
      if (propertyData.it) {
        staticData.reviews[propertySlug].it = propertyData.it;
        console.log(`   ✅ IT: ${propertyData.it.reviews.length} reviews (original)`);
      }
      
      // Create placeholder translations
      for (const targetLang of TARGET_LANGUAGES) {
        const sourceData = propertyData.en; // Use English as source
        if (!sourceData) {
          console.log(`   ⚠️  No English source data for ${propertySlug}, skipping ${targetLang}`);
          continue;
        }
        
        const translatedReviews = sourceData.reviews.map(review => 
          translateReview(review, targetLang)
        );
        
        staticData.reviews[propertySlug][targetLang] = {
          ...sourceData,
          reviews: translatedReviews
        };
        
        console.log(`   ✅ ${targetLang.toUpperCase()}: ${translatedReviews.length} reviews (placeholder)`);
      }
    }
    
    // Save static data
    const outputPath = path.join(__dirname, OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(staticData, null, 2), 'utf8');
    
    const stats = fs.statSync(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    console.log(`\n💾 Sample static data saved to: ${OUTPUT_FILE}`);
    console.log(`📦 File size: ${sizeKB} KB`);
    
    // Generate stats
    let totalReviews = 0;
    let totalResponses = 0;
    
    Object.keys(staticData.reviews).forEach(property => {
      Object.keys(staticData.reviews[property]).forEach(lang => {
        const langData = staticData.reviews[property][lang];
        if (langData && langData.reviews) {
          totalReviews += langData.reviews.length;
          totalResponses += langData.reviews.filter(r => r.response).length;
        }
      });
    });
    
    console.log('\n📊 SAMPLE DATA STATISTICS:');
    console.log('==========================');
    console.log(`🏠 Properties: ${staticData.metadata.properties.length}`);
    console.log(`🌍 Languages: ${staticData.metadata.languages.length}`);
    console.log(`📝 Total Reviews: ${totalReviews}`);
    console.log(`💬 Total Responses: ${totalResponses}`);
    
    console.log('\n🎉 SAMPLE DATA CREATED SUCCESSFULLY!');
    console.log('\n⚠️  IMPORTANT: This contains placeholder translations!');
    console.log('For production, run: node translate-reviews-batch.mjs');
    console.log('\n📋 Next Steps:');
    console.log('1. Test the migration with this sample data');
    console.log('2. Run full translation for production');
    console.log('3. Deploy to production');
    
  } catch (error) {
    console.error('\n💥 SAMPLE CREATION FAILED:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main().catch(console.error);
}