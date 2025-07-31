/**
 * Script di estrazione recensioni per migrazione a sistema statico
 * Estrae tutte le recensioni + host responses da Airbnb per entrambe le proprietà
 */

const fs = require('fs');
const path = require('path');

// Importa i moduli esistenti (simulazione - dovranno essere adattati)
const REVIEW_PROPERTY_MAPPING = {
  fienaroli: {
    listingId: '20247826', 
    airbnbId: 'AIRBNB_LISTING_ID_FIENAROLI',
    airbnbUrl: 'https://www.airbnb.it/rooms/20247826'
  },
  moro: {
    listingId: '998346242016693375',
    airbnbId: 'AIRBNB_LISTING_ID_MORO', 
    airbnbUrl: 'https://www.airbnb.it/rooms/998346242016693375'
  }
};

/**
 * Simula la chiamata API Airbnb per estrarre recensioni
 * In produzione userà il vero endpoint
 */
async function fetchReviewsFromAirbnb(propertySlug, limit = 12) {
  console.log(`🔍 Extracting reviews for ${propertySlug}...`);
  
  try {
    // Simula chiamata alla API esistente (sostituiremo con la vera chiamata)
    const apiUrl = `http://localhost:3000/api/reviews/${propertySlug}?limit=${limit}&locale=en`;
    
    console.log(`📡 Fetching from: ${apiUrl}`);
    
    // Per ora return mock data, poi sarà sostituito con vera chiamata
    return {
      reviews: [
        {
          id: `${propertySlug}_review_1`,
          comments: "Amazing stay! The apartment was exactly as described. Beautiful design with exposed beams and modern amenities.",
          originalComments: "Amazing stay! The apartment was exactly as described. Beautiful design with exposed beams and modern amenities.",
          language: "en",
          createdAt: "2024-01-15T10:30:00Z",
          localizedDate: "January 2024",
          rating: 5,
          reviewer: {
            firstName: "Sarah",
            location: "New York, United States",
            pictureUrl: "https://a0.muscache.com/im/pictures/...",
            isSuperhost: false
          },
          response: "Grazie mille Sarah! È stato un piacere avervi come ospiti. Siete sempre i benvenuti a Roma!",
          collectionTag: null,
          needsTranslation: false,
          disclaimer: ""
        },
        {
          id: `${propertySlug}_review_2`, 
          comments: "Fantastic location in Trastevere. The host was very responsive and helpful.",
          originalComments: "Fantastic location in Trastevere. The host was very responsive and helpful.",
          language: "en",
          createdAt: "2024-01-10T14:20:00Z", 
          localizedDate: "January 2024",
          rating: 5,
          reviewer: {
            firstName: "Marco",
            location: "Milan, Italy", 
            pictureUrl: "https://a0.muscache.com/im/pictures/...",
            isSuperhost: true
          },
          response: "Grazie Marco! Speriamo di rivedervi presto nel nostro bellissimo Trastevere.",
          collectionTag: null,
          needsTranslation: false,
          disclaimer: ""
        }
        // Aggiungeremo altre 10 recensioni reali...
      ],
      totalCount: 12,
      propertySlug: propertySlug,
      airbnbUrl: REVIEW_PROPERTY_MAPPING[propertySlug].airbnbUrl,
      fetchedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`❌ Error fetching reviews for ${propertySlug}:`, error);
    throw error;
  }
}

/**
 * Estrae tutte le recensioni per entrambe le proprietà
 */
async function extractAllReviews() {
  console.log('🚀 Starting reviews extraction...\n');
  
  const extractedData = {};
  
  for (const propertySlug of ['fienaroli', 'moro']) {
    try {
      console.log(`\n📋 Processing ${propertySlug.toUpperCase()}:`);
      
      const reviewsData = await fetchReviewsFromAirbnb(propertySlug, 12);
      extractedData[propertySlug] = reviewsData;
      
      console.log(`✅ Extracted ${reviewsData.reviews.length} reviews for ${propertySlug}`);
      console.log(`📝 Host responses found: ${reviewsData.reviews.filter(r => r.response).length}`);
      
    } catch (error) {
      console.error(`❌ Failed to extract reviews for ${propertySlug}:`, error.message);
      extractedData[propertySlug] = null;
    }
  }
  
  return extractedData;
}

/**
 * Salva i dati estratti in un file JSON
 */
function saveExtractedData(data, filename = 'extracted-reviews.json') {
  const outputPath = path.join(__dirname, filename);
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`\n💾 Data saved to: ${outputPath}`);
    
    // Stats
    let totalReviews = 0;
    let totalResponses = 0;
    
    Object.keys(data).forEach(property => {
      if (data[property] && data[property].reviews) {
        totalReviews += data[property].reviews.length;
        totalResponses += data[property].reviews.filter(r => r.response).length;
      }
    });
    
    console.log(`\n📊 EXTRACTION SUMMARY:`);
    console.log(`   Properties: ${Object.keys(data).length}`);
    console.log(`   Total Reviews: ${totalReviews}`);
    console.log(`   Host Responses: ${totalResponses}`);
    console.log(`   File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error saving data:', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🏠 TRASTEVERE LUXURY - Reviews Extraction Script');
    console.log('==================================================\n');
    
    const extractedData = await extractAllReviews();
    saveExtractedData(extractedData);
    
    console.log('\n🎉 Extraction completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Review extracted-reviews.json');
    console.log('2. Run translation script');
    console.log('3. Create static data structure');
    
  } catch (error) {
    console.error('\n💥 Extraction failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  extractAllReviews,
  saveExtractedData,
  fetchReviewsFromAirbnb
};