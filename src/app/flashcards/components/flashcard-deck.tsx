'use client';

import { WordDefinition } from '@/app/lib/definitions';
import clsx from 'clsx';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const meaningNavigationButtonClass =
  'icon-button h-9 w-9 border-[var(--sage)] bg-[var(--sage-soft)] text-[var(--sage-dark)] enabled:hover:bg-[var(--sage)] enabled:hover:text-[var(--paper-card)] enabled:active:bg-[var(--sage)] enabled:active:text-[var(--paper-card)]';
const definitionClass =
  'block rounded-2xl border border-[var(--brass)] bg-[var(--paper-card)]/85 px-3.5 py-2.5 text-sm font-medium break-words text-[var(--ink-muted)] sm:text-base';

const FlashcardDeck = ({ words }: { words: WordDefinition[] }) => {
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
          <span className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-[var(--brass)] p-5 text-center text-[var(--ink)] shadow-lg [backface-visibility:hidden] [background-image:linear-gradient(135deg,var(--paper-card),var(--paper))] sm:p-6">
            <span className="block max-w-full break-words text-[clamp(2rem,8vw,3.75rem)] font-semibold text-[var(--ink)] lg:text-6xl">
              {currentWord.word}
            </span>
          </span>

          <span className="absolute inset-0 flex flex-col gap-3 overflow-hidden rounded-[2rem] border border-[var(--brass)] p-4 text-left text-[var(--ink)] shadow-lg [backface-visibility:hidden] [background-image:linear-gradient(180deg,var(--paper-card),var(--paper))] [transform:rotateY(180deg)] sm:p-5">
            <span className="flex flex-wrap items-start justify-between gap-3">
              <span className="word-card-meanings-part-of-speech w-fit">
                {currentMeaning.part_of_speech}
              </span>

              {hasMultipleMeanings ? (
                <span className="ml-auto flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation();
                      goToPreviousMeaning();
                    }}
                    disabled={!canGoPreviousMeaning}
                    className={meaningNavigationButtonClass}
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
                    className={meaningNavigationButtonClass}
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
                    <span key={index} className={definitionClass}>
                      {definition}
                    </span>
                  ))}
                </span>
              ) : (
                <span className={definitionClass}>
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
        <div className="rounded-full border border-[var(--brass)] bg-[var(--paper-card)] px-4 py-1.5 text-sm font-bold text-[var(--ink-muted)]">
          {currentIndex + 1} / {words.length}
        </div>
      </div>
    </section>
  );
};

export default FlashcardDeck;
