'use client';

import AddWordDefinition from '@/app/diary/components/add-word-definition';
import { WordLookupResponse } from '@/app/lib/definitions';
import clsx from 'clsx';
import { ExternalLink, Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const EMPTY_WORD_ERROR_MESSAGE = 'Please enter a word before searching.';
const DEFINITION_NOT_FOUND_ERROR_MESSAGE =
  'Definition not found. Please try another word.';
const SOMETHING_WENT_WRONG = 'Something went wrong. Please try again.';

const AddWord = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [word, setWord] = useState('');
  const [error, setError] = useState('');
  const [wordDefinition, setWordDefinition] =
    useState<WordLookupResponse | null>(null);

  const resetLookup = () => {
    setWord('');
    setError('');
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
      searchDefinitionWithGoogle();
    } else if (event.key === 'Enter') {
      searchDefinition();
    }
  };

  const searchDefinitionWithGoogle = () => {
    const trimmedWord = word.trim();
    if (!trimmedWord) {
      setError(EMPTY_WORD_ERROR_MESSAGE);
      return;
    }
    const searchUrl = `https://www.google.com/search?q=define+${encodeURIComponent(trimmedWord)}`;
    window.open(searchUrl, '_blank');
  };

  const searchDefinition = async () => {
    const trimmedWord = word.trim().toLowerCase();
    if (!trimmedWord) {
      setError(EMPTY_WORD_ERROR_MESSAGE);
      return;
    }
    setError('');
    try {
      const response = await fetch(`/api/${encodeURIComponent(trimmedWord)}`);
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
        <Plus className="h-5 w-5" />
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/60"
          onClick={() => closeModal()}
        >
          <div
            className="relative max-h-[calc(100dvh-3rem)] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] shadow-2xl p-6"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex max-h-[calc(100dvh-6rem)] flex-col">
              <div>
                <h3 className="display-font text-2xl font-semibold text-[var(--ink)]">
                  Look up a word
                </h3>
                <button
                  type="button"
                  onClick={() => closeModal()}
                  className="absolute right-3 top-3 rounded-full p-2 text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="hide-scrollbar overflow-y-auto overscroll-contain mt-2">
                <div className="rounded-[2rem] border border-[var(--sage)] bg-[var(--paper-soft)] p-3">
                  <div className="flex items-center">
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
                      className="min-w-0 flex-1 px-3 py-3 text-lg font-semibold text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]"
                    />
                    <div className="flex gap-2 sm:pr-1">
                      <button
                        type="button"
                        onClick={searchDefinition}
                        className="inline-flex items-center justify-center rounded-full border border-[var(--sage)] bg-[var(--sage-dark)] px-3 py-2 text-xs font-bold text-[var(--paper-card)] transition-all duration-200 hover:bg-[var(--sage)] sm:text-sm"
                      >
                        <Search className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-3.5 sm:w-3.5" />
                        Search
                      </button>
                      <button
                        type="button"
                        onClick={searchDefinitionWithGoogle}
                        className="inline-flex items-center justify-center rounded-full border border-[var(--brass-dark)] bg-[var(--paper-card)] px-3 py-2 text-xs font-bold text-[var(--brass-dark)] transition-all duration-200 hover:bg-[var(--paper)] sm:text-sm"
                      >
                        <ExternalLink className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-3.5 sm:w-3.5" />
                        Google It
                      </button>
                    </div>
                  </div>
                  {error && (
                    <div className="error-message px-3 pt-1.5">{error}</div>
                  )}
                  <div className="pt-1.5 pb-1 flex flex-wrap items-center gap-x-2 gap-y-1 px-3 text-sm text-[var(--ink-muted)]">
                    <span className="flex items-center gap-1">
                      <span className="keycap-style">Enter</span>
                      <span>Search</span>
                    </span>
                    <span>·</span>
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
        </div>
      ) : null}
    </>
  );
};

export default AddWord;
