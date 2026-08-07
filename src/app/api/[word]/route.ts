import { getWordLookup, saveWordDefinition } from '@/app/lib/data';
import {
  convertDictionaryServiceResponse,
  getCurrentUser,
} from '@/app/lib/utils';
import type {
  DictionaryServiceResponse,
  WordLookupSuggestionsResponse,
} from '@/app/lib/definitions';
import { NextRequest, NextResponse } from 'next/server';

const DICTIONARY_CACHE_SECONDS = 60 * 60 * 24 * 30;

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ word: string }> }
) => {
  const { word } = await params;
  const normalizedWord = word.trim().toLowerCase();

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const storedWord = await getWordLookup(normalizedWord);
    if (storedWord) {
      console.log('Word found in database, returning stored definition');
      return NextResponse.json(storedWord);
    }

    const apiKey = process.env.DICTIONARY_API_KEY;
    if (!apiKey) {
      throw new Error('DICTIONARY_API_KEY is not configured');
    }

    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(normalizedWord)}?key=${apiKey}`,
      {
        next: {
          revalidate: DICTIONARY_CACHE_SECONDS,
        },
      }
    );

    if (!response.ok) {
      console.error('External dictionary request failed', {
        status: response.status,
        word: normalizedWord,
      });
      return NextResponse.json(
        { error: 'Failed to fetch definition' },
        { status: 500 }
      );
    }

    const dictionaryResponse: DictionaryServiceResponse = await response.json();
    const result = convertDictionaryServiceResponse(
      dictionaryResponse,
      normalizedWord
    );

    if (Array.isArray(result)) {
      return NextResponse.json<WordLookupSuggestionsResponse>({
        suggestions: result,
      });
    }

    if (!result) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    await saveWordDefinition(result);
    console.log('Word definition found externally and saved to database');
    return NextResponse.json({
      word: result,
      isInUserList: false,
    });
  } catch (error) {
    console.error('Word lookup failed', {
      error,
      word: normalizedWord,
    });
    return NextResponse.json(
      { error: 'Failed to fetch definition' },
      { status: 500 }
    );
  }
};
