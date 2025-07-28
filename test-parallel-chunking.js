const https = require('https');

// Test OpenAI translation with parallel chunked batches
async function testParallelChunking() {
  console.log('🧪 Testing parallel chunked batch translation (4 texts per batch)...\n');
  
  // Sample Italian review texts (simulating real data)
  const sampleTexts = [
    "Bellissima casa nel cuore di Trastevere. La posizione è perfetta per esplorare Roma a piedi.",
    "Grazie mille per la vostra recensione! Siamo felici che abbiate apprezzato la casa.",
    "Ottima esperienza! La casa è esattamente come nelle foto. Marco è stato un host eccellente.",
    "È stato un piacere ospitarvi! Tornate quando volete.",
    "Posizione fantastica, a due passi da tutti i migliori ristoranti di Trastevere.",
    "Grazie per le belle parole! Ci fa piacere che abbiate trovato tutto di vostro gradimento.",
    "Consiglio vivamente questa casa. È perfetta per una famiglia o un gruppo di amici.",
    "Siamo contenti che la terrazza vi sia piaciuta! È uno dei punti forti della casa.",
    "Abbiamo trascorso una settimana indimenticabile. La casa ha tutto il necessario.",
    "Grazie mille! Speriamo di rivedervi presto a Roma.",
    "L'appartamento supera le aspettative. Molto spazioso, pulito e in una posizione strategica.",
    "È stato un piacere conoscervi! Grazie per aver avuto cura della casa.",
    "Casa stupenda in una delle zone più belle di Roma. Vicina a tutto ma tranquilla.",
    "Grazie per la splendida recensione! Vi aspettiamo per il vostro prossimo viaggio.",
    "Tutto perfetto! Dalla comunicazione con l'host alla pulizia della casa.",
    "Grazie infinite per le vostre parole! Siete sempre i benvenuti.",
    "Location eccellente, appartamento curato nei minimi dettagli. Cucina ben attrezzata.",
    "Siamo felici che abbiate potuto cucinare e godervi la casa come fosse vostra!",
    "Una vera gemma nel cuore di Trastevere. Spaziosa, luminosa e con tutti i comfort.",
    "Vi aspettiamo a braccia aperte per la vostra prossima visita a Roma!",
    "Esperienza fantastica dall'inizio alla fine. Check-in facile, casa pulitissima.",
    "Grazie mille per la fiducia! È stato un piacere ospitarvi.",
    "La casa dei sogni per visitare Roma. Posizione imbattibile e appartamento perfetto.",
    "Che belle parole! Siamo felicissimi che vi siate sentiti a casa."
  ];
  
  console.log(`📊 Test Parameters:`);
  console.log(`- Total texts: ${sampleTexts.length}`);
  console.log(`- Chunk size: 4 texts per batch`);
  console.log(`- Number of chunks: ${Math.ceil(sampleTexts.length / 4)}`);
  console.log(`- Execution: PARALLEL with Promise.all()`);
  console.log(`- Using model: gpt-3.5-turbo\n`);
  
  const totalStartTime = Date.now();
  const chunkSize = 4;
  const chunks = [];
  
  // Split into chunks of 4
  for (let i = 0; i < sampleTexts.length; i += chunkSize) {
    chunks.push(sampleTexts.slice(i, i + chunkSize));
  }
  
  console.log(`🚀 Processing ${chunks.length} chunks in PARALLEL...`);
  
  // Function to translate a single chunk
  async function translateChunk(chunk, chunkIndex) {
    const chunkStartTime = Date.now();
    
    console.log(`⏱️ Starting chunk ${chunkIndex + 1} (${chunk.length} texts)...`);
    
    const systemPrompt = "You are a professional translator. Translate the following Airbnb reviews from Italian to English. Maintain the original tone, style, and meaning. Return the translations as a JSON array where each element is just the translated text string, in the same order as provided.";
    
    const textsForPrompt = chunk.map((text, index) => `${index + 1}. ${text}`);
    const userPrompt = `Please translate these texts:\n\n${textsForPrompt.join('\n\n')}\n\nReturn as JSON array: ["translation1", "translation2", ...]`;
    
    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 800
    };
    
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    };
    
    try {
      const response = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        });
        req.on('error', reject);
        req.write(JSON.stringify(requestBody));
        req.end();
      });
      
      const chunkTime = Date.now() - chunkStartTime;
      console.log(`✅ Chunk ${chunkIndex + 1} completed in ${chunkTime}ms`);
      
      if (response.choices && response.choices[0]) {
        const content = response.choices[0].message.content;
        console.log(`🔍 Chunk ${chunkIndex + 1} raw response: ${content.substring(0, 100)}...`);
        
        // Try multiple parsing strategies
        let chunkTranslations = [];
        
        // Strategy 1: Find JSON array
        const jsonStart = content.indexOf('[');
        const jsonEnd = content.lastIndexOf(']');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
          try {
            const jsonString = content.substring(jsonStart, jsonEnd + 1);
            chunkTranslations = JSON.parse(jsonString);
            console.log(`✅ Chunk ${chunkIndex + 1} JSON parsed: ${chunkTranslations.length} translations`);
          } catch (e) {
            console.log(`❌ Chunk ${chunkIndex + 1} JSON parse failed, trying fallback...`);
            
            // Strategy 2: Split by lines and clean
            chunkTranslations = content
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0)
              .map(line => line.replace(/^\d+\.\s*/, ''))  // Remove "1. " prefixes
              .map(line => line.replace(/^["\[\]]/, ''))   // Remove JSON artifacts
              .map(line => line.replace(/["\[\]]$/, ''))   // Remove JSON artifacts
              .filter(line => line.length > 0)
              .slice(0, chunk.length); // Limit to expected count
          }
        }
        
        return {
          chunkIndex,
          translations: chunkTranslations,
          chunkTime,
          originalTexts: chunk
        };
      }
      
      return {
        chunkIndex,
        translations: [],
        chunkTime,
        originalTexts: chunk
      };
      
    } catch (error) {
      console.error(`❌ Error in chunk ${chunkIndex + 1}:`, error.message);
      return {
        chunkIndex,
        translations: [],
        chunkTime: Date.now() - chunkStartTime,
        originalTexts: chunk,
        error: error.message
      };
    }
  }
  
  // Execute all chunks in parallel
  const chunkPromises = chunks.map((chunk, index) => translateChunk(chunk, index));
  const results = await Promise.all(chunkPromises);
  
  const totalTime = Date.now() - totalStartTime;
  
  // Collect all translations in order
  const allTranslations = [];
  let totalApiTime = 0;
  let successfulChunks = 0;
  
  results
    .sort((a, b) => a.chunkIndex - b.chunkIndex) // Ensure correct order
    .forEach(result => {
      allTranslations.push(...result.translations);
      totalApiTime = Math.max(totalApiTime, result.chunkTime); // Max time (parallel execution)
      if (result.translations.length > 0) successfulChunks++;
      
      if (result.error) {
        console.log(`⚠️ Chunk ${result.chunkIndex + 1} had error: ${result.error}`);
      }
    });
  
  console.log(`\n📊 Final Results:`);
  console.log(`- Total time (parallel): ${totalTime}ms (${(totalTime/1000).toFixed(2)}s)`);
  console.log(`- Longest chunk time: ${totalApiTime}ms`);
  console.log(`- Successful chunks: ${successfulChunks}/${chunks.length}`);
  console.log(`- Successfully translated: ${allTranslations.length}/${sampleTexts.length} texts`);
  console.log(`- Average per text: ${(totalTime/sampleTexts.length).toFixed(0)}ms`);
  console.log(`\n🔥 Performance Comparison:`);
  console.log(`- Single batch (24 texts): ~12,200ms`);
  console.log(`- Sequential chunks: ~1,345ms`);
  console.log(`- Parallel chunks: ${totalTime}ms`);
  console.log(`- Improvement vs single: ${((12200 - totalTime) / 12200 * 100).toFixed(1)}% faster`);
  console.log(`- Improvement vs sequential: ${((1345 - totalTime) / 1345 * 100).toFixed(1)}% faster`);
  
  if (allTranslations.length > 0) {
    console.log(`\n📝 Sample translations:`);
    for (let i = 0; i < Math.min(3, allTranslations.length); i++) {
      console.log(`${i + 1}. Original: ${sampleTexts[i]}`);
      console.log(`   Translation: ${allTranslations[i]}`);
    }
  }
}

// Run the test
testParallelChunking();