'use client';
import WordItem from '@/app/(search)/components/word-item';
import { Word } from '@/app/lib/definitions';
import { useState } from 'react';

export default function WordList({ initialWords }: { initialWords: Word[] }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [words, setWords] = useState(initialWords);

  return (
    <div className="mt-12 flex flex-col gap-3 items-center">
      {words.map(word => (
        <WordItem key={word.id} word={word} />
      ))}
    </div>
  );
}
