'use client';

import { FlashcardWord } from '@/app/lib/definitions';
import clsx from 'clsx';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const FlashcardDeck = ({ words }: { words: FlashcardWord[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shouldSkipFlipTransition, setShouldSkipFlipTransition] =
    useState(false);
  const [meaningIndex, setMeaningIndex] = useState(0);

  const currentWord = words[currentIndex];
  const meanings = currentWord.meanings;
  const currentMeaning = meanings[meaningIndex];
  const hasMultipleMeanings = meanings.length > 1;
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < words.length - 1;
  const canGoPreviousMeaning = meaningIndex > 0;
  const canGoNextMeaning = meaningIndex < meanings.length - 1;

  useEffect(() => {
    if (!shouldSkipFlipTransition) {
      return;
    }
    const frameId = window.requestAnimationFrame(() => {
      setShouldSkipFlipTransition(false);
    });
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [shouldSkipFlipTransition]);

  const resetCardFace = () => {
    setShouldSkipFlipTransition(true);
    setIsFlipped(false);
    setMeaningIndex(0);
  };

  const goToPreviousCard = () => {
    if (!canGoPrevious) {
      return;
    }
    setCurrentIndex(current => current - 1);
    resetCardFace();
  };

  const goToNextCard = () => {
    if (!canGoNext) {
      return;
    }
    setCurrentIndex(current => current + 1);
    resetCardFace();
  };

  const goToPreviousMeaning = () => {
    if (!canGoPreviousMeaning) {
      return;
    }
    setMeaningIndex(current => current - 1);
  };

  const goToNextMeaning = () => {
    if (!canGoNextMeaning) {
      return;
    }
    setMeaningIndex(current => current + 1);
  };

  const flipCard = () => {
    setIsFlipped(current => !current);
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-5">
      <div className="mx-auto flex w-full justify-center [perspective:1400px]">
        <div
          onClick={flipCard}
          className={clsx(
            'relative block h-[clamp(14rem,52vw,20rem)] w-[min(86vw,38rem)] cursor-pointer outline-none [transform-style:preserve-3d] lg:h-[23rem] lg:w-full lg:max-w-2xl',
            shouldSkipFlipTransition
              ? 'transition-none'
              : 'transition-[transform] duration-[520ms] [transition-timing-function:cubic-bezier(0.2,0.85,0.2,1)]',
            isFlipped && '[transform:rotateY(180deg)]'
          )}
        >
          <span className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-[var(--brass)] p-5 text-center text-[var(--ink)] shadow-xl [backface-visibility:hidden] [background-image:linear-gradient(135deg,var(--paper-card),var(--paper))] [box-shadow:0_18px_48px_rgb(43_33_24_/_0.16)] sm:p-6">
            <span className="display-font block max-w-full break-words text-[clamp(2rem,8vw,3.75rem)] font-semibold text-[var(--ink)] lg:text-6xl">
              {currentWord.word}
            </span>
          </span>

          <span className="absolute inset-0 flex flex-col gap-3 overflow-hidden rounded-[2rem] border border-[var(--brass)] p-4 text-left text-[var(--ink)] shadow-xl [backface-visibility:hidden] [background-image:linear-gradient(180deg,var(--paper-card),var(--paper))] [box-shadow:0_18px_48px_rgb(43_33_24_/_0.16)] [transform:rotateY(180deg)] sm:p-5">
            <span className="flex items-start justify-between gap-3">
              <span className="inline-flex w-fit rounded-full border border-[var(--sage)] bg-[var(--sage-soft)] px-3 py-1 text-xs font-bold uppercase text-[var(--sage-dark)]">
                {currentMeaning.part_of_speech}
              </span>

              {hasMultipleMeanings ? (
                <span className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation();
                      goToPreviousMeaning();
                    }}
                    disabled={!canGoPreviousMeaning}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--sage)] bg-[var(--sage-soft)] text-[var(--sage-dark)] shadow-sm transition-all duration-200 hover:bg-[var(--sage)] hover:text-[var(--paper-card)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--sage-soft)] disabled:hover:text-[var(--sage-dark)]"
                    title="Previous meaning"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="rounded-full border border-[var(--brass)] bg-[var(--paper-card)] px-2.5 py-1 text-xs font-bold whitespace-nowrap text-[var(--ink-muted)]">
                    {meaningIndex + 1} / {meanings.length}
                  </span>
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation();
                      goToNextMeaning();
                    }}
                    disabled={!canGoNextMeaning}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--sage)] bg-[var(--sage-soft)] text-[var(--sage-dark)] shadow-sm transition-all duration-200 hover:bg-[var(--sage)] hover:text-[var(--paper-card)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--sage-soft)] disabled:hover:text-[var(--sage-dark)]"
                    title="Next meaning"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </span>
              ) : null}
            </span>
            <span className="flex min-h-0 flex-1 items-center">
              {currentMeaning ? (
                <span className="flex max-h-full w-full flex-col gap-2.5 overflow-y-auto pr-1">
                  {currentMeaning.definitions.map((definition, index) => (
                    <span
                      key={index}
                      className="block rounded-2xl border border-[var(--brass)] bg-[rgb(255_248_232_/_0.86)] px-3.5 py-2.5 text-sm font-medium break-words text-[var(--ink)] sm:text-base"
                    >
                      {definition}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="block rounded-2xl border border-[var(--brass)] bg-[rgb(255_248_232_/_0.86)] px-3.5 py-2.5 text-sm font-medium break-words text-[var(--ink)] sm:text-base">
                  No definitions saved for this word.
                </span>
              )}
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={goToPreviousCard}
            disabled={!canGoPrevious}
            className="pagination-nav-button"
            title="Previous card"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToNextCard}
            disabled={!canGoNext}
            className="pagination-nav-button"
            title="Next card"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-full border border-[var(--brass)] bg-[var(--paper-card)] px-4 py-1.5 text-sm font-bold text-[var(--ink-muted)] shadow-sm">
          {currentIndex + 1} / {words.length}
        </div>
      </div>
    </section>
  );
};

export default FlashcardDeck;
