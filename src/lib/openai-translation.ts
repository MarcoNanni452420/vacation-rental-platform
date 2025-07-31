interface TranslationRequest {
  text: string;
  targetLang: 'it' | 'en' | 'fr' | 'de' | 'es';
  sourceText?: string; // per debugging
}

export async function translateReview(request: TranslationRequest): Promise<string> {
  const { text, targetLang } = request;
  
  const languagePrompts = {
    'en': "You are a translation assistant that translates text from Italian to English. Translate Airbnb reviews maintaining the original tone and style. Return only the translation, no explanations.",
    'it': "You are a translation assistant that translates text from English to Italian. Translate Airbnb reviews maintaining the original tone and style. Return only the translation, no explanations.",
    'fr': "You are a translation assistant that translates text from English to French. Translate Airbnb reviews maintaining the original tone and style. Return only the translation, no explanations.",
    'de': "You are a translation assistant that translates text from English to German. Translate Airbnb reviews maintaining the original tone and style. Return only the translation, no explanations.",
    'es': "You are a translation assistant that translates text from English to Spanish. Translate Airbnb reviews maintaining the original tone and style. Return only the translation, no explanations."
  };
  
  const systemPrompt = languagePrompts[targetLang];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
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
    const errorText = await response.text();
    throw new Error(`Translation failed: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || text;
}