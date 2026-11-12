import {
  getCurrentProfile,
  getWordLookup,
  saveWordDefinition,
} from '@/app/lib/data';
import { resolveDictionaryLookup } from '@/app/lib/dictionary-resolver';
import { getCurrentUser } from '@/app/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ word: string }> }
) => {
  const { word } = await params;
  const normalizedWord = word.trim().normalize('NFC').toLowerCase();
  if (!normalizedWord || normalizedWord.length > 128) {
    return NextResponse.json(
      { error: 'Enter a word of 1–128 characters.' },
      { status: 400 }
    );
  }
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      const user = await getCurrentUser();
      return NextResponse.json(
        { error: user ? 'Forbidden' : 'Unauthorized' },
        { status: user ? 403 : 401 }
      );
    }
    const storedWord = await getWordLookup(normalizedWord);
    if (storedWord) {
      console.log('Word found in database, returning stored definition', {
        word: normalizedWord,
      });
      return NextResponse.json(storedWord);
    }
    const result = await resolveDictionaryLookup(normalizedWord);
    switch (result.status) {
      case 'suggestions':
        return NextResponse.json({ suggestions: result.suggestions });
      case 'not-found':
        return NextResponse.json({ error: 'Word not found' }, { status: 404 });
      case 'success':
        await saveWordDefinition(result.word);
        console.log('Word definition found externally and saved to database', {
          word: normalizedWord,
        });
        return NextResponse.json({
          word: result.word,
          isInUserList: false,
        });
    }
  } catch (error) {
    console.error('Word lookup failed', { error, word: normalizedWord });
    return NextResponse.json(
      { error: 'Unable to load this word. Please try again.' },
      { status: 500 }
    );
  }
};
