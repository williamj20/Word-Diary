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
    <section className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-4 sm:gap-5">
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
      <div className="mx-auto flex w-full min-w-0 justify-center px-5 [perspective:1400px] sm:px-8">
        <div
          tabIndex={0}
          onClick={event => {
            if ((event.target as HTMLElement).closest('a')) {
              return;
            }
            setIsFlipped(current => !current);
          }}
          className={clsx(
            'relative grid h-80 w-full min-w-0 max-w-2xl shrink-0 grid-cols-1 grid-rows-1 cursor-pointer rounded-[2rem] outline-none [transform-style:preserve-3d] sm:h-96 lg:h-[26rem]',
            skipTransition
              ? 'transition-none'
              : 'transition-[transform] duration-[520ms] [transition-timing-function:cubic-bezier(0.2,0.85,0.2,1)]',
            isFlipped && '[transform:rotateY(180deg)]'
          )}
        >
          <div
            inert={isFlipped}
            className="col-start-1 row-start-1 flex min-h-0 min-w-0 flex-col overflow-y-auto rounded-[2rem] border border-[var(--paper-muted)] p-5 text-center text-[var(--ink)] shadow-lg [backface-visibility:hidden] [background-image:linear-gradient(135deg,var(--paper-card),var(--paper))] sm:p-6"
          >
            <div className="my-auto flex shrink-0 flex-col items-center gap-5">
              <div className="max-w-full text-4xl font-semibold wrap-anywhere sm:text-5xl md:text-6xl">
                {currentWord.word}
              </div>
              <div className="max-w-full">
                <PronunciationButton
                  pronunciationWord={meaning.pronunciationWord}
                  pronunciationText={meaning.pronunciationText}
                  pronunciationUrl={meaning.pronunciationUrl}
                />
              </div>
              <span className="text-xs text-[var(--ink-muted)]">
                Tap to reveal definitions
              </span>
            </div>
          </div>
          <div
            inert={!isFlipped}
            className="col-start-1 row-start-1 min-h-0 min-w-0 overflow-y-auto rounded-[2rem] border border-[var(--paper-muted)] p-4 text-left text-[var(--ink)] shadow-lg [backface-visibility:hidden] [background-image:linear-gradient(180deg,var(--paper-card),var(--paper))] [transform:rotateY(180deg)] sm:p-6"
          >
            <div className="mb-3 text-sm font-semibold wrap-anywhere text-[var(--ink-muted)] sm:text-base">
              {currentWord.word}
            </div>
            <WordMeaning meaning={meaning} />
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
