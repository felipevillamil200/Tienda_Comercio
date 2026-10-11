import { NextRequest, NextResponse } from 'next/server';
import { translateWithAi, isAiConfigured } from '@/lib/aiProvider';
import { getTranslation, PRODUCT_TRANSLATIONS, Language } from '@/lib/i18n';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, targetLang = 'EN', context, productId } = body;

    if (productId && PRODUCT_TRANSLATIONS[productId] && targetLang === 'EN') {
      return NextResponse.json({
        translated: PRODUCT_TRANSLATIONS[productId],
        source: 'cached_gemini_dictionary',
        aiConfigured: isAiConfigured()
      });
    }

    if (!text) {
      return NextResponse.json({ error: 'Text or productId is required' }, { status: 400 });
    }

    // Try live translation via AI Provider
    if (isAiConfigured()) {
      const translated = await translateWithAi({
        text,
        targetLang: targetLang as Language,
        context
      });
      return NextResponse.json({
        translated,
        source: 'ai_provider_api',
        aiConfigured: true
      });
    }

    // Fallback translation
    const translated = getTranslation(text, targetLang as Language);
    return NextResponse.json({
      translated,
      source: 'i18n_fallback',
      geminiConfigured: false
    });
  } catch (error: any) {
    console.error('[API Translate Error]:', error);
    return NextResponse.json({ error: 'Failed to translate' }, { status: 500 });
  }
}
