'use client';

import PronunciationButton from '@/app/components/pronunciation-button';
import WordMeaning from '@/app/diary/components/word-meaning';
import type { WordDefinition } from '@/app/lib/definitions';
import clsx from 'clsx';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const FlashcardDeck = ({ words }: { words: WordDefinition[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [meaningIndex, setMeaningIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false);
  const wordIndex = Math.min(currentIndex, words.length - 1);
  const currentWord = words[wordIndex];
  const sourceIndex = Math.min(meaningIndex, currentWord.meanings.length - 1);
  const meaning = currentWord.meanings[sourceIndex];

  useEffect(() => {
    if (!skipTransition) {
      return;
    }
    const frame = requestAnimationFrame(() => setSkipTransition(false));
    return () => cancelAnimationFrame(frame);
  }, [skipTransition]);

  const changeWord = (next: number) => {
    setCurrentIndex(next);
    setMeaningIndex(0);
    setIsFlipped(false);
    setSkipTransition(true);
  };
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-5">
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center justify-center gap-3">
          <button
            type="button"
            title="Previous source"
            disabled={sourceIndex === 0}
            onClick={() => setMeaningIndex(sourceIndex - 1)}
            className="pagination-nav-button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold text-[var(--ink-muted)] sm:text-sm">
            Source {sourceIndex + 1} of {currentWord.meanings.length}
          </span>
          <button
            type="button"
            title="Next source"
            disabled={sourceIndex === currentWord.meanings.length - 1}
            onClick={() => setMeaningIndex(sourceIndex + 1)}
            className="pagination-nav-button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mx-auto flex w-full justify-center [perspective:1400px]">
        <div
          onClick={event => {
            if ((event.target as HTMLElement).closest('a')) {
              return;
            }
            setIsFlipped(current => !current);
          }}
          className={clsx(
            'relative h-[clamp(20rem,52vw,26rem)] w-[min(90vw,42rem)] cursor-pointer [transform-style:preserve-3d]',
            skipTransition
              ? 'transition-none'
              : 'transition-[transform] duration-[520ms] [transition-timing-function:cubic-bezier(0.2,0.85,0.2,1)]',
            isFlipped && '[transform:rotateY(180deg)]'
          )}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 overflow-hidden rounded-[2rem] border border-[var(--brass)] p-5 text-center text-[var(--ink)] shadow-lg [backface-visibility:hidden] [background-image:linear-gradient(135deg,var(--paper-card),var(--paper))] sm:p-6">
            <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="min-w-max text-[clamp(2rem,8vw,3.75rem)] font-semibold">
                {currentWord.word}
              </div>
            </div>
            {!isFlipped ? (
              <PronunciationButton
                pronunciationWord={meaning.pronunciationWord}
                pronunciationText={meaning.pronunciationText}
                pronunciationUrl={meaning.pronunciationUrl}
              />
            ) : null}
            <span className="text-xs text-[var(--ink-muted)]">
              Tap to reveal definitions
            </span>
          </div>
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-[var(--brass)] p-4 text-left text-[var(--ink)] shadow-lg [backface-visibility:hidden] [background-image:linear-gradient(180deg,var(--paper-card),var(--paper))] [transform:rotateY(180deg)] sm:p-6">
            <div className="h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="mb-3 flex items-center justify-between gap-3 text-sm text-[var(--ink-muted)] sm:text-base">
                <span className="font-semibold">{currentWord.word}</span>
              </div>
              {isFlipped ? <WordMeaning meaning={meaning} /> : null}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          title="Previous card"
          disabled={wordIndex === 0}
          onClick={() => changeWord(wordIndex - 1)}
          className="pagination-nav-button"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-[var(--ink-muted)]">
          {wordIndex + 1} / {words.length}
        </span>
        <button
          type="button"
          title="Next card"
          disabled={wordIndex === words.length - 1}
          onClick={() => changeWord(wordIndex + 1)}
          className="pagination-nav-button"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};
export default FlashcardDeck;
