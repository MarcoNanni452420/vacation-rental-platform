interface HostResponseTranslation {
  originalResponse: string;
  translatedResponse: string;
  reviewId: string;
}

export async function translateHostResponses(
  responses: Array<{ id: string; response: string }>,
  targetLang: string = 'en'
): Promise<HostResponseTranslation[]> {
  if (!responses || responses.length === 0) {
    return [];
  }

  const BATCH_SIZE = 3;
  const batches: Array<{ id: string; response: string }[]> = [];
  
  // Split into batches of 3
  for (let i = 0; i < responses.length; i += BATCH_SIZE) {
    batches.push(responses.slice(i, i + BATCH_SIZE));
  }

  console.log(`🔄 Translating ${responses.length} host responses in ${batches.length} parallel batches`);

  // Function to translate a single batch
  async function translateBatch(batch: Array<{ id: string; response: string }>): Promise<HostResponseTranslation[]> {
    const systemPrompt = `You are a professional translator. Translate the following Airbnb host responses from Italian to ${targetLang === 'en' ? 'English' : targetLang}. Maintain the friendly, welcoming tone. Return as a JSON array of translated strings in the same order.`;
    
    const textsForPrompt = batch.map((item, index) => `${index + 1}. ${item.response}`);
    const userPrompt = `Translate these host responses:\n\n${textsForPrompt.join('\n\n')}\n\nReturn as JSON array: ["translation1", "translation2", ...]`;
    
    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 400
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.choices[0]?.message?.content || '';
      
      // Parse JSON response
      let translations: string[] = [];
      try {
        const jsonStart = translatedText.indexOf('[');
        const jsonEnd = translatedText.lastIndexOf(']');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonString = translatedText.substring(jsonStart, jsonEnd + 1);
          translations = JSON.parse(jsonString);
        }
      } catch (parseError) {
        console.log('JSON parsing failed, using fallback parsing');
        // Fallback parsing
        translations = translatedText
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0)
          .map((line: string) => line.replace(/^\d+\.\s*/, ''))
          .map((line: string) => line.replace(/^["\[\]]/, ''))
          .map((line: string) => line.replace(/["\[\]]$/, ''))
          .filter((line: string) => line.length > 0)
          .slice(0, batch.length);
      }
      
      // Map back to original structure
      return batch.map((item, index) => ({
        reviewId: item.id,
        originalResponse: item.response,
        translatedResponse: translations[index] || item.response
      }));
      
    } catch (error) {
      console.error('Translation batch error:', error);
      // Return original responses on error
      return batch.map(item => ({
        reviewId: item.id,
        originalResponse: item.response,
        translatedResponse: item.response
      }));
    }
  }

  try {
    // Execute all batches in parallel
    const batchPromises = batches.map(batch => translateBatch(batch));
    const batchResults = await Promise.all(batchPromises);
    
    // Flatten results
    const allTranslations = batchResults.flat();
    
    console.log(`✅ Translated ${allTranslations.length} host responses`);
    return allTranslations;
    
  } catch (error) {
    console.error('Host response translation failed:', error);
    // Return original responses
    return responses.map(item => ({
      reviewId: item.id,
      originalResponse: item.response,
      translatedResponse: item.response
    }));
  }
}