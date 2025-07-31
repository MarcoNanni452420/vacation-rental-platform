#!/usr/bin/env node

/**
 * Script di traduzione batch per recensioni e host responses
 * Traduce tutto in FR/DE/ES partendo dai dati estratti
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurazione
const INPUT_FILE = 'real-reviews-extracted.json';
const OUTPUT_FILE = 'static-reviews-complete.json';
const TARGET_LANGUAGES = ['fr', 'de', 'es'];
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Controlla che la chiave OpenAI sia disponibile
if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in environment variables');
  process.exit(1);
}

/**
 * Traduce un testo usando OpenAI
 */
async function translateText(text, targetLang, sourceContext = 'review') {
  const languageNames = {
    'fr': 'French',
    'de': 'German', 
    'es': 'Spanish'
  };
  
  const contextPrompts = {
    'review': `You are a professional translator specializing in hospitality. Translate this Airbnb guest review from English to ${languageNames[targetLang]}. Maintain the original tone, enthusiasm, and authenticity. Return only the translation.`,
    'response': `You are a professional translator specializing in hospitality. Translate this Airbnb host response from Italian to ${languageNames[targetLang]}. Maintain the warm, welcoming, and professional tone typical of luxury accommodations. Return only the translation.`
  };
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: contextPrompts[sourceContext]
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || text;
    
  } catch (error) {
    console.error(`❌ Translation error (${targetLang}):`, error.message);
    return text; // Return original text on error
  }
}

/**
 * Traduce una singola recensione completa
 */
async function translateReview(review, targetLang) {
  console.log(`   🔄 Translating review ${review.id} to ${targetLang.toUpperCase()}...`);
  
  // Translate review text (EN → target)
  const translatedComments = await translateText(review.comments, targetLang, 'review');
  
  // Translate host response if present (IT → target)
  let translatedResponse = null;
  if (review.response) {
    translatedResponse = await translateText(review.response, targetLang, 'response');
  }
  
  // Small delay to respect rate limits
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    ...review,
    comments: translatedComments,
    response: translatedResponse,
    originalComments: review.originalComments || review.comments,
    originalResponse: review.response,
    needsTranslation: false,
    disclaimer: getDisclaimer(targetLang)
  };
}

/**
 * Disclaimer tradotto per lingua
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
 * Traduce tutte le recensioni per una proprietà e lingua
 */
async function translatePropertyReviews(propertyData, targetLang) {
  console.log(`🔄 Translating ${propertyData.reviews.length} reviews to ${targetLang.toUpperCase()}...`);
  
  const translatedReviews = [];
  
  for (const review of propertyData.reviews) {
    try {
      const translatedReview = await translateReview(review, targetLang);
      translatedReviews.push(translatedReview);
      
    } catch (error) {
      console.error(`❌ Failed to translate review ${review.id}:`, error.message);
      // Keep original review on error
      translatedReviews.push({
        ...review,
        disclaimer: `Translation failed - ${getDisclaimer(targetLang)}`
      });
    }
  }
  
  return {
    ...propertyData,
    reviews: translatedReviews
  };
}

/**
 * Carica i dati estratti
 */
function loadExtractedData() {
  const inputPath = path.join(__dirname, INPUT_FILE);
  
  try {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${INPUT_FILE}. Run extract-real-reviews.mjs first.`);
    }
    
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log(`📖 Loaded data from: ${INPUT_FILE}`);
    return data;
    
  } catch (error) {
    console.error('❌ Error loading extracted data:', error.message);
    throw error;
  }
}

/**
 * Processa tutte le traduzioni
 */
async function processAllTranslations() {
  console.log('🌍 Starting batch translation process...\n');
  
  const extractedData = loadExtractedData();
  
  // Prepare final data structure
  const staticData = {
    metadata: {
      createdAt: new Date().toISOString(),
      source: 'batch-translation',
      languages: ['en', 'it', ...TARGET_LANGUAGES],
      properties: Object.keys(extractedData.data)
    },
    reviews: {}
  };
  
  // Process each property
  for (const propertySlug of Object.keys(extractedData.data)) {
    console.log(`\n🏠 Processing ${propertySlug.toUpperCase()}:`);
    
    staticData.reviews[propertySlug] = {};
    
    // Copy existing EN and IT data
    const propertyData = extractedData.data[propertySlug];
    if (propertyData.en) {
      staticData.reviews[propertySlug].en = propertyData.en;
      console.log(`   ✅ EN: ${propertyData.en.reviews.length} reviews (original)`);
    }
    if (propertyData.it) {
      staticData.reviews[propertySlug].it = propertyData.it;
      console.log(`   ✅ IT: ${propertyData.it.reviews.length} reviews (original)`);
    }
    
    // Translate to target languages
    for (const targetLang of TARGET_LANGUAGES) {
      try {
        console.log(`\n   🔄 Translating to ${targetLang.toUpperCase()}...`);
        
        // Use English as source for translations
        const sourceData = propertyData.en;
        if (!sourceData) {
          console.log(`   ⚠️  No English source data for ${propertySlug}, skipping ${targetLang}`);
          continue;
        }
        
        const translatedData = await translatePropertyReviews(sourceData, targetLang);
        staticData.reviews[propertySlug][targetLang] = translatedData;
        
        console.log(`   ✅ ${targetLang.toUpperCase()}: ${translatedData.reviews.length} reviews translated`);
        
        // Longer delay between languages to respect rate limits 
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`   ❌ Failed to translate ${propertySlug} to ${targetLang}:`, error.message);
        staticData.reviews[propertySlug][targetLang] = null;
      }
    }
  }
  
  return staticData;
}

/**
 * Salva i dati tradotti
 */
function saveStaticData(data) {
  const outputPath = path.join(__dirname, OUTPUT_FILE);
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
    
    const stats = fs.statSync(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    console.log(`\n💾 Static data saved to: ${outputPath}`);
    console.log(`📦 File size: ${sizeKB} KB`);
    
    return outputPath;
    
  } catch (error) {
    console.error('❌ Error saving static data:', error);
    throw error;
  }
}

/**
 * Genera statistiche finali
 */
function generateStats(data) {
  console.log('\n📊 TRANSLATION SUMMARY:');
  console.log('=======================');
  
  let totalTranslations = 0;
  let totalHostResponses = 0;
  
  Object.keys(data.reviews).forEach(property => {
    console.log(`\n🏠 ${property.toUpperCase()}:`);
    
    Object.keys(data.reviews[property]).forEach(lang => {
      const langData = data.reviews[property][lang];
      if (langData && langData.reviews) {
        const reviewCount = langData.reviews.length;
        const responseCount = langData.reviews.filter(r => r.response).length;
        
        console.log(`   ${lang.toUpperCase()}: ${reviewCount} reviews, ${responseCount} host responses`);
        
        if (TARGET_LANGUAGES.includes(lang)) {
          totalTranslations += reviewCount + responseCount;
        }
        totalHostResponses += responseCount;
      }
    });
  });
  
  console.log(`\n🎯 TOTALS:`);
  console.log(`   Languages: ${data.metadata.languages.length}`);
  console.log(`   Properties: ${data.metadata.properties.length}`);  
  console.log(`   New Translations: ${totalTranslations}`);
  console.log(`   Total Host Responses: ${totalHostResponses}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 TRASTEVERE LUXURY - Batch Translation');
  console.log('=========================================\n');
  
  try {
    const staticData = await processAllTranslations();
    const outputPath = saveStaticData(staticData);
    generateStats(staticData);
    
    console.log('\n🎉 TRANSLATION COMPLETED SUCCESSFULLY!');
    console.log('\n📋 Next Steps:');
    console.log('1. Review translated content in output file'); 
    console.log('2. Migrate API to use static data');
    console.log('3. Test the complete system');
    console.log(`\n📄 Output: ${path.basename(outputPath)}`);
    
  } catch (error) {
    console.error('\n💥 TRANSLATION FAILED:', error.message);
    console.error('\nTroubleshooting:');
    console.error('- Check OPENAI_API_KEY environment variable');
    console.error('- Ensure input file exists (run extract script first)');
    console.error('- Check internet connection for API calls');
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main().catch(console.error);
}