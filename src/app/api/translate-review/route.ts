import { NextRequest, NextResponse } from 'next/server';
import { translateReview } from '@/lib/openai-translation';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, reviewId } = await request.json();
    
    // Validation
    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required fields: text and targetLang are required' }, 
        { status: 400 }
      );
    }

    if (!['it', 'en'].includes(targetLang)) {
      return NextResponse.json(
        { error: 'Invalid targetLang. Must be "it" or "en"' }, 
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' }, 
        { status: 500 }
      );
    }

    const translatedText = await translateReview({ text, targetLang });
    
    return NextResponse.json({
      originalText: text,
      translatedText,
      targetLang,
      reviewId,
      success: true
    });
    
  } catch (error) {
    // Silently handle translation error
    
    // Return more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown translation error';
    
    return NextResponse.json(
      { 
        error: 'Translation failed', 
        details: errorMessage,
        success: false 
      }, 
      { status: 500 }
    );
  }
}