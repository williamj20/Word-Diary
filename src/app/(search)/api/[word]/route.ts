import { DictionaryServiceObject } from '@/app/lib/definitions';
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.DICTIONARY_API_KEY;

export async function GET(
  _request: NextRequest,
  { params }: { params: { word: string } }
) {
  const { word } = await params;
  try {
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
    let data: DictionaryServiceObject[] = await response.json();
    data.map(entry => {
      if (entry.hwi && entry.hwi.hw) {
        entry.hwi.hw = entry.hwi.hw.replaceAll('*', '');
      }
      return entry;
    });
    data = data.filter(
      (entry: DictionaryServiceObject) => entry.hwi && entry.hwi.hw === word
    );
    if (data.length === 0) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }
    data = data.slice(0, 6);
    return NextResponse.json(data, {
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
}
