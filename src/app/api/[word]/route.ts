import { getWordFromUserList, getWordFromWordsTable } from '@/app/lib/data';
import { DictionaryServiceObject } from '@/app/lib/definitions';
import {
  convertDictionaryServiceResponse,
  getCurrentUser,
} from '@/app/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.DICTIONARY_API_KEY;

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
    const wordFromUserList = await getWordFromUserList(user.id, normalizedWord);
    if (wordFromUserList) {
      console.log('Retrieving word from user list', wordFromUserList);
      return NextResponse.json({
        word: wordFromUserList.word,
        isInUserList: true,
      });
    }
    const wordFromWordsTable = await getWordFromWordsTable(normalizedWord);
    if (wordFromWordsTable) {
      console.log('Retrieving word from words table', wordFromWordsTable);
      return NextResponse.json({
        word: wordFromWordsTable,
        isInUserList: false,
      });
    }

    console.log('Fetching definition from external API: ', normalizedWord);
    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(normalizedWord)}?key=${API_KEY}`,
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
    const formattedWord = convertDictionaryServiceResponse(res, normalizedWord);
    if (!formattedWord) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }
    return NextResponse.json({ word: formattedWord, isInUserList: false });
  } catch (error) {
    console.error('Error fetching definition:', error);
    return NextResponse.json(
      { error: 'Failed to fetch definition' },
      { status: 500 }
    );
  }
};
