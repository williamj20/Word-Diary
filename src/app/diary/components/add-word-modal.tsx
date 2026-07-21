'use client';

import AddWordDefinition from '@/app/diary/components/add-word-definition';
import { WordLookupResponse } from '@/app/lib/definitions';
import clsx from 'clsx';
import { ExternalLink, Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const EMPTY_WORD_ERROR_MESSAGE = 'Please enter a word before searching.';
const DEFINITION_NOT_FOUND_ERROR_MESSAGE =
  'Definition not found. Please try another word.';
const SOMETHING_WENT_WRONG = 'Something went wrong. Please try again.';

const AddWordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [word, setWord] = useState('');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [wordDefinition, setWordDefinition] =
    useState<WordLookupResponse | null>(null);
  const trimmedWord = word.trim();
  const googleDefinitionUrl = `https://www.google.com/search?q=define+${encodeURIComponent(trimmedWord)}`;

  const resetLookup = () => {
    setWord('');
    setError('');
    setIsSearching(false);
    setWordDefinition(null);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetLookup();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setWord('');
        setError('');
        setIsSearching(false);
        setWordDefinition(null);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      if (!trimmedWord) {
        setError(EMPTY_WORD_ERROR_MESSAGE);
        return;
      }
      window.open(googleDefinitionUrl, '_blank', 'noopener,noreferrer');
    } else if (event.key === 'Enter') {
      searchDefinition();
    }
  };

  const handleGoogleDefinitionClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!trimmedWord) {
      event.preventDefault();
      setError(EMPTY_WORD_ERROR_MESSAGE);
    }
  };

  const searchDefinition = async () => {
    if (isSearching) {
      return;
    }

    const lookupWord = word.trim().toLowerCase();
    if (!lookupWord) {
      setError(EMPTY_WORD_ERROR_MESSAGE);
      return;
    }

    setError('');
    setIsSearching(true);

    try {
      const response = await fetch(`/api/${encodeURIComponent(lookupWord)}`);
      const data = await response.json();
      if (!response.ok) {
        setWordDefinition(null);
        if (response.status === 404) {
          setError(DEFINITION_NOT_FOUND_ERROR_MESSAGE);
        } else {
          setError(SOMETHING_WENT_WRONG);
        }
        return;
      }
      setWordDefinition(data);
    } catch (error) {
      console.error('Error fetching definition:', error);
      setWordDefinition(null);
      setError(SOMETHING_WENT_WRONG);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          resetLookup();
          setIsOpen(true);
        }}
        className="icon-button border-[var(--sage)] bg-[var(--sage-dark)] text-[var(--paper-card)] hover:bg-[var(--sage)]"
      >
        <Plus className="h-4 w-4" />
      </button>

      {isOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex min-w-xs items-center justify-center bg-[var(--ink)]/60 p-3 sm:p-4"
              onClick={() => closeModal()}
            >
              <div
                className="relative max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] p-4 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-6"
                onClick={event => event.stopPropagation()}
              >
                <div className="flex max-h-[calc(100dvh-4rem)] flex-col sm:max-h-[calc(100dvh-6rem)]">
                  <div>
                    <h3 className="display-font mb-2 text-xl font-semibold text-[var(--ink)] sm:text-2xl">
                      Look up a word
                    </h3>
                    <button
                      type="button"
                      onClick={() => closeModal()}
                      className="absolute right-2.5 top-2.5 rounded-full p-1.5 text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)] sm:right-3 sm:top-3 sm:p-2"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>

                  <div className="hide-scrollbar mt-2 overflow-y-auto overscroll-contain">
                    <div className="rounded-[2rem] border border-[var(--sage)] bg-[var(--paper-soft)] p-2 sm:p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <input
                          type="text"
                          id="searchWord"
                          autoFocus
                          autoComplete="off"
                          value={word}
                          onChange={e => {
                            setWord(e.target.value);
                            setError('');
                          }}
                          onKeyDown={handleInputKeyDown}
                          className="min-w-0 flex-1 px-2.5 py-2.5 text-base font-semibold text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] sm:px-3 sm:py-3 sm:text-lg"
                        />
                        <div className="flex gap-2 sm:pr-1">
                          <button
                            type="button"
                            disabled={isSearching}
                            onClick={searchDefinition}
                            className="inline-flex min-w-24 items-center justify-center rounded-full border border-[var(--sage)] bg-[var(--sage-dark)] px-3 py-2 text-xs font-bold text-[var(--paper-card)] transition-all duration-200 hover:bg-[var(--sage)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[var(--sage-dark)] sm:text-sm"
                          >
                            <Search className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-3.5 sm:w-3.5" />
                            {isSearching ? 'Searching...' : 'Search'}
                          </button>
                          <a
                            href={googleDefinitionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleGoogleDefinitionClick}
                            className="inline-flex items-center justify-center rounded-full border border-[var(--brass-dark)] bg-[var(--paper-card)] px-3 py-2 text-xs font-bold text-[var(--brass-dark)] transition-all duration-200 hover:bg-[var(--paper)] sm:text-sm"
                          >
                            <ExternalLink className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-3.5 sm:w-3.5" />
                            Google It
                          </a>
                        </div>
                      </div>
                      {error && (
                        <div className="error-message px-3 pt-1.5">{error}</div>
                      )}
                      {isSearching && !error ? (
                        <div className="px-3 pt-1.5 text-xs font-semibold text-[var(--ink-muted)] sm:text-sm">
                          Searching dictionary...
                        </div>
                      ) : null}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-2.5 pb-1 pt-1.5 text-xs text-[var(--ink-muted)] sm:px-3 sm:text-sm">
                        <span className="flex items-center gap-1">
                          <span className="keycap-style">Enter</span>
                          <span>Search</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="keycap-style">Shift</span>
                          <span>+</span>
                          <span className="keycap-style">Enter</span>
                          <span>Google</span>
                        </span>
                      </div>
                      <div className={clsx(wordDefinition ? 'mt-4' : 'mt-0')}>
                        <AddWordDefinition
                          wordDefinition={wordDefinition}
                          onSave={() => {
                            setIsOpen(false);
                            resetLookup();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default AddWordModal;
