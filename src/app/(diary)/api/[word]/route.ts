import { getWordFromUserList } from '@/app/lib/data';
import { DictionaryServiceObject } from '@/app/lib/definitions';
import { convertDictionaryServiceResponse } from '@/app/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.DICTIONARY_API_KEY;

export const GET = async (
  _request: NextRequest,
  { params }: { params: { word: string } }
) => {
  const { word } = await params;
  try {
    const wordFromDB = await getWordFromUserList(1, word);
    if (wordFromDB) {
      return NextResponse.json(wordFromDB, {
        headers: {
          'Cache-Control': 'public, max-age=604800',
        },
      });
    }
    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(word)}?key=${API_KEY}`,
      {
        next: {
          revalidate: 604800,
        },
      }
    );
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch definition' },
        { status: 500 }
      );
    }
    const res: DictionaryServiceObject[] = await response.json();
    if (res.length === 0) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }
    const formattedWord = convertDictionaryServiceResponse(res, word);
    if (!formattedWord) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }
    return NextResponse.json(formattedWord, {
      headers: {
        'Cache-Control': 'public, max-age=604800',
      },
    });
  } catch (error) {
    console.error('Error fetching definition:', error);
    return NextResponse.json(
      { error: 'Failed to fetch definition' },
      { status: 500 }
    );
  }
};
