'use client';

import PronunciationButton from '@/app/components/pronunciation-button';
import WordMeaning from '@/app/diary/components/word-meaning';
import type { WordDefinition } from '@/app/lib/definitions';
import clsx from 'clsx';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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

  const changeWord = useCallback((next: number) => {
    setCurrentIndex(next);
    setMeaningIndex(0);
    setIsFlipped(false);
    setSkipTransition(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !(event.target instanceof HTMLElement) ||
        event.target.closest('button, a, summary') ||
        document.querySelector('details[open]')
      ) {
        return;
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const next = wordIndex + (event.key === 'ArrowLeft' ? -1 : 1);
        if (next >= 0 && next < words.length) {
          changeWord(next);
        }
      } else if (event.code === 'Space') {
        event.preventDefault();
        setIsFlipped(current => !current);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [wordIndex, words.length, changeWord]);

  return (
    <section className="mx-auto flex w-full min-w-min max-w-6xl flex-col gap-4 sm:gap-5">
      <div className="flex min-w-max items-center justify-center gap-3">
        <button
          type="button"
          title="Previous source"
          disabled={sourceIndex === 0}
          onClick={() => setMeaningIndex(sourceIndex - 1)}
          className="pagination-nav-button"
        >
          <ChevronLeft />
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
          <ChevronRight />
        </button>
      </div>
      <div className="mx-auto flex w-full min-w-min justify-center [perspective:1400px]">
        <div
          tabIndex={0}
          onClick={event => {
            if ((event.target as HTMLElement).closest('a')) {
              return;
            }
            setIsFlipped(current => !current);
          }}
          className={clsx(
            'relative grid min-h-[clamp(20rem,52vw,26rem)] w-[min(90vw,42rem)] min-w-min shrink-0 cursor-pointer rounded-[2rem] [transform-style:preserve-3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--sage)]',
            skipTransition
              ? 'transition-none'
              : 'transition-[transform] duration-[520ms] [transition-timing-function:cubic-bezier(0.2,0.85,0.2,1)]',
            isFlipped && '[transform:rotateY(180deg)]'
          )}
        >
          <div className="col-start-1 row-start-1 flex min-w-min flex-col items-center justify-center gap-5 rounded-[2rem] border border-[var(--paper-muted)] p-5 text-center text-[var(--ink)] shadow-lg [backface-visibility:hidden] [background-image:linear-gradient(135deg,var(--paper-card),var(--paper))] sm:p-6">
            <div className="min-w-max text-[clamp(2rem,8vw,3.75rem)] font-semibold">
              {currentWord.word}
            </div>
            {!isFlipped ? (
              <div className="min-w-max">
                <PronunciationButton
                  pronunciationWord={meaning.pronunciationWord}
                  pronunciationText={meaning.pronunciationText}
                  pronunciationUrl={meaning.pronunciationUrl}
                />
              </div>
            ) : null}
            <span className="text-xs text-[var(--ink-muted)]">
              Tap to reveal definitions
            </span>
          </div>
          <div className="col-start-1 row-start-1 min-w-min rounded-[2rem] border border-[var(--paper-muted)] p-4 text-left text-[var(--ink)] shadow-lg [backface-visibility:hidden] [background-image:linear-gradient(180deg,var(--paper-card),var(--paper))] [transform:rotateY(180deg)] sm:p-6">
            <div className="mb-3 break-words text-sm font-semibold text-[var(--ink-muted)] sm:text-base">
              {currentWord.word}
            </div>
            {isFlipped ? <WordMeaning meaning={meaning} /> : null}
          </div>
        </div>
      </div>
      <div className="flex min-w-max items-center justify-center gap-3">
        <button
          type="button"
          title="Previous card"
          disabled={wordIndex === 0}
          onClick={() => changeWord(wordIndex - 1)}
          className="pagination-nav-button"
        >
          <ArrowLeft />
        </button>
        <span className="text-sm font-semibold text-[var(--ink-muted)]">
          Word {wordIndex + 1} of {words.length}
        </span>
        <button
          type="button"
          title="Next card"
          disabled={wordIndex === words.length - 1}
          onClick={() => changeWord(wordIndex + 1)}
          className="pagination-nav-button"
        >
          <ArrowRight />
        </button>
      </div>
      <p className="text-center text-xs text-[var(--ink-muted)] sm:text-sm">
        ← → to change words · Space to flip
      </p>
    </section>
  );
};
export default FlashcardDeck;
