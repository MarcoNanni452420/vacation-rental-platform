#!/usr/bin/env node

/**
 * Tool per aggiornamenti periodici delle recensioni statiche
 * Permette di mantenere aggiornato il contenuto senza costi API
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurazione
const STATIC_DATA_PATH = path.join(process.cwd(), 'src/data/static-reviews.json');
const BACKUP_DIR = path.join(process.cwd(), 'src/data/backup');

/**
 * Crea backup dei dati attuali
 */
function createBackup() {
  if (!fs.existsSync(STATIC_DATA_PATH)) {
    console.log('⚠️  No existing static data to backup');
    return null;
  }
  
  // Crea directory backup se non esiste
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `static-reviews-${timestamp}.json`);
  
  fs.copyFileSync(STATIC_DATA_PATH, backupPath);
  console.log(`📦 Backup created: ${path.basename(backupPath)}`);
  
  return backupPath;
}

/**
 * Mostra menu delle opzioni disponibili
 */
function showMenu() {
  console.log('\n📋 UPDATE OPTIONS:');
  console.log('==================');
  console.log('1. 🔄 Full refresh (extract + translate)');
  console.log('2. 📝 Edit specific review');
  console.log('3. 💬 Edit host response');
  console.log('4. ➕ Add new review');
  console.log('5. 🗑️  Remove review');
  console.log('6. 📊 Show statistics');
  console.log('7. 🔍 Search reviews');
  console.log('8. 📤 Export data');
  console.log('9. ❌ Exit');
  console.log('\nWhat would you like to do?');
}

/**
 * Carica i dati statici attuali
 */
function loadStaticData() {
  if (!fs.existsSync(STATIC_DATA_PATH)) {
    throw new Error('Static data file not found. Run the migration first.');
  }
  
  const rawData = fs.readFileSync(STATIC_DATA_PATH, 'utf8');
  return JSON.parse(rawData);
}

/**
 * Salva i dati aggiornati
 */
function saveStaticData(data) {
  // Aggiorna metadata
  data.metadata = {
    ...data.metadata,
    lastUpdated: new Date().toISOString(),
    updatedBy: 'manual-update-tool'
  };
  
  fs.writeFileSync(STATIC_DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('💾 Static data updated successfully');
}

/**
 * Mostra statistiche dei dati
 */
function showStatistics(data) {
  console.log('\n📊 CURRENT STATISTICS:');
  console.log('======================');
  
  let totalReviews = 0;
  let totalResponses = 0;
  
  Object.keys(data.reviews || {}).forEach(property => {
    console.log(`\n🏠 ${property.toUpperCase()}:`);
    
    Object.keys(data.reviews[property] || {}).forEach(lang => {
      const langData = data.reviews[property][lang];
      if (langData && langData.reviews) {
        const reviewCount = langData.reviews.length;
        const responseCount = langData.reviews.filter(r => r.response).length;
        
        console.log(`   ${lang.toUpperCase()}: ${reviewCount} reviews, ${responseCount} responses`);
        totalReviews += reviewCount;
        totalResponses += responseCount;
      }
    });
  });
  
  console.log(`\n🎯 TOTALS:`);
  console.log(`   Properties: ${Object.keys(data.reviews || {}).length}`);
  console.log(`   Languages: ${data.metadata?.languages?.length || 0}`);
  console.log(`   Total Reviews: ${totalReviews}`);
  console.log(`   Total Responses: ${totalResponses}`);
  console.log(`   Last Updated: ${data.metadata?.lastUpdated || 'Unknown'}`);
  console.log(`   Created: ${data.metadata?.createdAt || 'Unknown'}`);
}

/**
 * Cerca recensioni per testo
 */
function searchReviews(data, searchTerm) {
  console.log(`\n🔍 Searching for: "${searchTerm}"`);
  console.log('============================');
  
  let found = 0;
  
  Object.keys(data.reviews || {}).forEach(property => {
    Object.keys(data.reviews[property] || {}).forEach(lang => {
      const langData = data.reviews[property][lang];
      if (langData && langData.reviews) {
        langData.reviews.forEach((review, index) => {
          const matchesComment = review.comments?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesResponse = review.response?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesReviewer = review.reviewer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
          
          if (matchesComment || matchesResponse || matchesReviewer) {
            found++;
            console.log(`\n${found}. ${property}/${lang} - Review #${index + 1}`);
            console.log(`   👤 ${review.reviewer?.firstName || 'Unknown'} (${review.rating}⭐)`);
            console.log(`   📝 ${review.comments?.substring(0, 100)}...`);
            if (review.response) {
              console.log(`   💬 ${review.response.substring(0, 100)}...`);
            }
          }
        });
      }
    });
  });
  
  console.log(`\n✅ Found ${found} matches`);
}

/**
 * Esporta dati in formato leggibile
 */
function exportData(data, format = 'summary') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const exportPath = path.join(__dirname, `reviews-export-${timestamp}.txt`);
  
  let output = `TRASTEVERE LUXURY - Reviews Export\n`;
  output += `Generated: ${new Date().toISOString()}\n`;
  output += `=====================================\n\n`;
  
  Object.keys(data.reviews || {}).forEach(property => {
    output += `🏠 ${property.toUpperCase()}\n`;
    output += `${'='.repeat(property.length + 3)}\n\n`;
    
    Object.keys(data.reviews[property] || {}).forEach(lang => {
      const langData = data.reviews[property][lang];
      if (langData && langData.reviews) {
        output += `📍 ${lang.toUpperCase()} (${langData.reviews.length} reviews)\n\n`;
        
        langData.reviews.forEach((review, index) => {
          output += `${index + 1}. ${review.reviewer?.firstName || 'Anonymous'} - ${review.rating}⭐\n`;
          output += `   Date: ${review.localizedDate || review.createdAt}\n`;
          output += `   Review: ${review.comments}\n`;
          if (review.response) {
            output += `   Host Response: ${review.response}\n`;
          }
          output += `\n`;
        });
        
        output += `\n`;
      }
    });
  });
  
  fs.writeFileSync(exportPath, output, 'utf8');
  console.log(`📤 Data exported to: ${path.basename(exportPath)}`);
  
  return exportPath;
}

/**
 * Esegue un refresh completo
 */
async function fullRefresh() {
  console.log('\n🔄 Starting full refresh...');
  console.log('This will:');
  console.log('1. Extract fresh reviews from Airbnb');
  console.log('2. Translate everything to all languages');
  console.log('3. Update the static data file');
  console.log('\n⚠️  This will use your OpenAI API credits!');
  
  // Qui implementeresti la chiamata agli altri script
  console.log('\n📋 To perform full refresh:');
  console.log('1. Run: node extract-real-reviews.mjs');
  console.log('2. Run: node translate-reviews-batch.mjs');
  console.log('3. Run: node migrate-to-static.mjs');
  console.log('\nOr use the combined command:');
  console.log('npm run update-reviews-full');
}

/**
 * Main interactive loop
 */
async function interactiveMode() {
  console.log('🏛️  TRASTEVERE LUXURY - Reviews Update Tool');
  console.log('==========================================\n');
  
  // Create backup
  createBackup();
  
  // Load current data
  let data;
  try {
    data = loadStaticData();
    console.log('✅ Loaded current static data');
  } catch (error) {
    console.error('❌ Error loading static data:', error.message);
    return;
  }
  
  // Interactive loop
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  function askQuestion(question) {
    return new Promise(resolve => rl.question(question, resolve));
  }
  
  while (true) {
    showMenu();
    const choice = await askQuestion('\nEnter your choice (1-9): ');
    
    switch (choice.trim()) {
      case '1':
        await fullRefresh();
        break;
        
      case '6':
        showStatistics(data);
        break;
        
      case '7':
        const searchTerm = await askQuestion('\nEnter search term: ');
        if (searchTerm.trim()) {
          searchReviews(data, searchTerm.trim());
        }
        break;
        
      case '8':
        exportData(data);
        break;
        
      case '9':
        console.log('\n👋 Goodbye!');
        rl.close();
        return;
        
      default:
        console.log('\n❌ Invalid choice. Please try again.');
    }
    
    await askQuestion('\nPress Enter to continue...');
  }
}

/**
 * Command line mode
 */
async function commandMode(command, ...args) {
  const data = loadStaticData();
  
  switch (command) {
    case 'stats':
      showStatistics(data);
      break;
      
    case 'search':
      if (args[0]) {
        searchReviews(data, args[0]);
      } else {
        console.log('❌ Usage: node update-reviews.mjs search "search term"');
      }
      break;
      
    case 'export':
      exportData(data);
      break;
      
    case 'backup':
      createBackup();
      break;
      
    default:
      console.log('❌ Unknown command. Available: stats, search, export, backup');
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      // Interactive mode
      await interactiveMode();
    } else {
      // Command line mode
      await commandMode(...args);
    }
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main().catch(console.error);
}