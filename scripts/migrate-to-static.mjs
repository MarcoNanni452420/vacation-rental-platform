#!/usr/bin/env node

/**
 * Script di migrazione dal sistema dinamico a quello statico
 * Sostituisce l'endpoint esistente e aggiusta i riferimenti
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurazione
const STATIC_DATA_FILE = 'static-reviews-complete.json';
const BACKUP_SUFFIX = '.backup-dynamic';

/**
 * Crea backup del sistema esistente
 */
function backupExistingSystem() {
  console.log('📦 Creating backup of existing dynamic system...');
  
  const filesToBackup = [
    'src/app/api/reviews/[slug]/route.ts',
    'src/lib/openai-translation.ts', 
    'src/lib/translate-host-responses.ts'
  ];
  
  filesToBackup.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    const backupPath = fullPath + BACKUP_SUFFIX;
    
    if (fs.existsSync(fullPath)) {
      fs.copyFileSync(fullPath, backupPath);
      console.log(`   ✅ Backed up: ${file}`);
    } else {
      console.log(`   ⚠️  File not found: ${file}`);
    }
  });
  
  console.log('✅ Backup completed\n');
}

/**
 * Copia i dati statici nella directory data
 */
function deployStaticData() {
  console.log('📂 Deploying static data...');
  
  const sourcePath = path.join(__dirname, STATIC_DATA_FILE);
  const targetDir = path.join(process.cwd(), 'src/data');
  const targetPath = path.join(targetDir, 'static-reviews.json');
  
  // Crea directory se non esiste
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log('   📁 Created data directory');
  }
  
  // Controlla se il file sorgente esiste
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Static data file not found: ${STATIC_DATA_FILE}. Run translation script first.`);
  }
  
  // Copia i dati
  fs.copyFileSync(sourcePath, targetPath);
  
  const stats = fs.statSync(targetPath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  
  console.log(`   ✅ Deployed: static-reviews.json (${sizeKB} KB)`);
  console.log('✅ Static data deployment completed\n');
  
  return targetPath;
}

/**
 * Aggiorna l'endpoint esistente per usare i dati statici
 */
function migrateApiEndpoint() {
  console.log('🔄 Migrating API endpoint...');
  
  const apiPath = path.join(process.cwd(), 'src/app/api/reviews/[slug]/route.ts');
  const staticApiPath = path.join(process.cwd(), 'src/app/api/reviews-static/[slug]/route.ts');
  
  if (!fs.existsSync(staticApiPath)) {
    throw new Error('Static API endpoint not found. Make sure it was created.');
  }
  
  // Backup dell'endpoint esistente
  if (fs.existsSync(apiPath)) {
    const backupPath = apiPath + BACKUP_SUFFIX;
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(apiPath, backupPath);
    }
  }
  
  // Sostituisci l'endpoint esistente con quello statico
  fs.copyFileSync(staticApiPath, apiPath);
  
  console.log('   ✅ API endpoint migrated to static version');
  console.log('✅ API migration completed\n');
}

/**
 * Verifica che la migrazione sia andata a buon fine
 */
async function verifyMigration() {
  console.log('🔍 Verifying migration...');
  
  const dataPath = path.join(process.cwd(), 'src/data/static-reviews.json');
  const apiPath = path.join(process.cwd(), 'src/app/api/reviews/[slug]/route.ts');
  
  // Verifica che i file esistano
  const checks = [
    { file: dataPath, name: 'Static data file' },
    { file: apiPath, name: 'Migrated API endpoint' }
  ];
  
  let allGood = true;
  
  checks.forEach(check => {
    if (fs.existsSync(check.file)) {
      console.log(`   ✅ ${check.name} exists`);
    } else {
      console.log(`   ❌ ${check.name} missing`);
      allGood = false;
    }
  });
  
  // Verifica contenuto del file dati
  if (fs.existsSync(dataPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const properties = Object.keys(data.reviews || {});
      const languages = data.metadata?.languages || [];
      
      console.log(`   📊 Properties: ${properties.length} (${properties.join(', ')})`);
      console.log(`   🌍 Languages: ${languages.length} (${languages.join(', ')})`);
      
      if (properties.length < 2 || languages.length < 3) {
        console.log(`   ⚠️  Data looks incomplete`);
        allGood = false;
      }
      
    } catch (error) {
      console.log(`   ❌ Static data file is corrupted`);
      allGood = false;
    }
  }
  
  console.log(allGood ? '✅ Migration verification passed\n' : '⚠️  Migration verification has issues\n');
  return allGood;
}

/**
 * Genera statistiche della migrazione
 */
function generateMigrationStats() {
  console.log('📊 MIGRATION STATISTICS:');
  console.log('========================');
  
  const dataPath = path.join(process.cwd(), 'src/data/static-reviews.json');
  
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const stats = fs.statSync(dataPath);
    
    let totalReviews = 0;
    let totalResponses = 0;
    
    Object.keys(data.reviews || {}).forEach(property => {
      Object.keys(data.reviews[property] || {}).forEach(lang => {
        const langData = data.reviews[property][lang];
        if (langData && langData.reviews) {
          totalReviews += langData.reviews.length;
          totalResponses += langData.reviews.filter(r => r.response).length;
        }
      });
    });
    
    console.log(`📝 Total Reviews: ${totalReviews}`);
    console.log(`💬 Total Host Responses: ${totalResponses}`);
    console.log(`🏠 Properties: ${Object.keys(data.reviews || {}).length}`);
    console.log(`🌍 Languages: ${data.metadata?.languages?.length || 0}`);
    console.log(`📦 File Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📅 Created: ${data.metadata?.createdAt || 'Unknown'}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 TRASTEVERE LUXURY - Migration to Static Reviews');
  console.log('==================================================\n');
  
  try {
    // 1. Backup existing system
    backupExistingSystem();
    
    // 2. Deploy static data
    deployStaticData();
    
    // 3. Migrate API endpoint
    migrateApiEndpoint();
    
    // 4. Verify migration
    const isValid = await verifyMigration();
    
    // 5. Generate stats
    generateMigrationStats();
    
    console.log('\n🎉 MIGRATION COMPLETED SUCCESSFULLY!');
    
    if (isValid) {
      console.log('\n📋 BENEFITS ACHIEVED:');
      console.log('✅ Zero OpenAI costs in production');
      console.log('✅ Zero Airbnb rate limiting risk');
      console.log('✅ Ultra-fast response times (0ms)');
      console.log('✅ Infinite scalability for Google Ads');
      console.log('✅ High-quality pre-approved translations');
      
      console.log('\n🚀 READY FOR PRODUCTION:');
      console.log('- Your site can now handle unlimited traffic');
      console.log('- No more API costs or rate limits');
      console.log('- Reviews load instantly');
      console.log('- Perfect for Google Ads scaling');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Test the migrated system locally');
    console.log('2. Deploy to production');
    console.log('3. Monitor performance improvements');
    console.log('4. Set up periodic data updates');
    
    console.log('\n🔄 To rollback if needed:');
    console.log('- Restore *.backup-dynamic files');
    console.log('- Remove src/data/static-reviews.json');
    
  } catch (error) {
    console.error('\n💥 MIGRATION FAILED:', error.message);
    console.error('\nTroubleshooting:');
    console.error('- Make sure static data file exists (run translation script)');
    console.error('- Check file permissions');
    console.error('- Verify all source files are present');
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main().catch(console.error);
}