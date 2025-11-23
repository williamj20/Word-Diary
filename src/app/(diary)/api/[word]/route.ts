import { getWordFromUserList, getWordFromWordsTable } from '@/app/lib/data';
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
    const wordFromUserList = await getWordFromUserList(1, word);
    if (wordFromUserList) {
      return NextResponse.json(
        { word: wordFromUserList, isInUserList: true },
        {
          headers: {
            'Cache-Control': 'public, max-age=604800',
          },
        }
      );
    }
    const wordFromWordsTable = await getWordFromWordsTable(word);
    if (wordFromWordsTable) {
      return NextResponse.json(
        { word: wordFromWordsTable, isInUserList: false },
        {
          headers: {
            'Cache-Control': 'public, max-age=604800',
          },
        }
      );
    }
    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(word)}?key=${API_KEY}`,
      {
        next: {
          revalidate: false,
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
    return NextResponse.json(
      { word: formattedWord, isInUserList: false },
      {
        headers: {
          'Cache-Control': 'public, max-age=604800',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching definition:', error);
    return NextResponse.json(
      { error: 'Failed to fetch definition' },
      { status: 500 }
    );
  }
};
