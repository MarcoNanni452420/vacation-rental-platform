#!/usr/bin/env node

/**
 * Script di traduzione veloce - traduce in batch ridotti per evitare timeout
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurazione ridotta per essere più veloce
const INPUT_FILE = 'real-reviews-extracted.json';
const OUTPUT_FILE = 'static-reviews-complete.json';
const TARGET_LANGUAGES = ['fr', 'de', 'es'];
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found');
  process.exit(1);
}

/**
 * Traduce un testo - versione veloce
 */
async function translateText(text, targetLang, sourceContext = 'review') {
  const languageNames = {
    'fr': 'French',
    'de': 'German', 
    'es': 'Spanish'
  };
  
  const contextPrompts = {
    'review': `Translate this Airbnb guest review from English to ${languageNames[targetLang]}. Keep it natural and authentic. Return only the translation:`,
    'response': `Translate this Airbnb host response from Italian to ${languageNames[targetLang]}. Keep it warm and professional. Return only the translation:`
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
        max_tokens: 300
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || text;
    
  } catch (error) {
    console.error(`❌ Translation error (${targetLang}):`, error.message);
    return text;
  }
}

/**
 * Traduce una recensione velocemente
 */
async function translateReview(review, targetLang) {
  // Translate review text (EN → target)
  const translatedComments = await translateText(review.comments, targetLang, 'review');
  
  // Translate host response if present (IT → target)
  let translatedResponse = null;
  if (review.response) {
    translatedResponse = await translateText(review.response, targetLang, 'response');
  }
  
  return {
    ...review,
    comments: translatedComments,
    response: translatedResponse,
    originalComments: review.comments,
    originalResponse: review.response,
    needsTranslation: false,
    disclaimer: getDisclaimer(targetLang)
  };
}

function getDisclaimer(lang) {
  const disclaimers = {
    'fr': 'Traduit automatiquement',
    'de': 'Automatisch übersetzt', 
    'es': 'Traducido automáticamente'
  };
  return disclaimers[lang] || '';
}

async function main() {
  console.log('🔄 QUICK TRANSLATION - Processing all reviews...\n');
  
  try {
    // Load data
    const inputPath = path.join(__dirname, INPUT_FILE);
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const extractedData = JSON.parse(rawData);
    
    // Prepare structure
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
      console.log(`🏠 ${propertySlug.toUpperCase()}:`);
      
      staticData.reviews[propertySlug] = {};
      const propertyData = extractedData.data[propertySlug];
      
      // Copy existing data
      if (propertyData.en) {
        staticData.reviews[propertySlug].en = propertyData.en;
        console.log(`   ✅ EN: ${propertyData.en.reviews.length} reviews`);
      }
      if (propertyData.it) {
        staticData.reviews[propertySlug].it = propertyData.it;
        console.log(`   ✅ IT: ${propertyData.it.reviews.length} reviews`);
      }
      
      // Translate to each target language
      for (const targetLang of TARGET_LANGUAGES) {
        const sourceData = propertyData.en;
        if (!sourceData) continue;
        
        console.log(`   🔄 ${targetLang.toUpperCase()}...`);
        
        // Process all reviews concurrently in small batches
        const BATCH_SIZE = 3;
        const translatedReviews = [];
        
        for (let i = 0; i < sourceData.reviews.length; i += BATCH_SIZE) {
          const batch = sourceData.reviews.slice(i, i + BATCH_SIZE);
          
          const batchResults = await Promise.all(
            batch.map(review => translateReview(review, targetLang))
          );
          
          translatedReviews.push(...batchResults);
          
          // Small delay between batches
          if (i + BATCH_SIZE < sourceData.reviews.length) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
        
        staticData.reviews[propertySlug][targetLang] = {
          ...sourceData,
          reviews: translatedReviews
        };
        
        console.log(`   ✅ ${targetLang.toUpperCase()}: ${translatedReviews.length} reviews translated`);
      }
    }
    
    // Save result
    const outputPath = path.join(__dirname, OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(staticData, null, 2), 'utf8');
    
    const stats = fs.statSync(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    console.log(`\n💾 Saved: ${OUTPUT_FILE} (${sizeKB} KB)`);
    console.log('🎉 TRANSLATION COMPLETED!');
    
  } catch (error) {
    console.error('\n💥 FAILED:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);