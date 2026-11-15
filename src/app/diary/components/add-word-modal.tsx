'use client';

import AddWordDefinition from '@/app/diary/components/add-word-definition';
import type {
  WordLookupResponse,
  WordLookupSuggestionsResponse,
} from '@/app/lib/definitions';
import { ExternalLink, Plus, Search, X } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const keycapClass =
  'rounded-md border border-[var(--paper-muted)] px-2 py-0.5 text-xs font-bold text-[var(--ink)] [background-image:linear-gradient(180deg,var(--paper-card),var(--paper-muted))]';

const EMPTY_WORD_ERROR_MESSAGE = 'Please enter a word before searching.';
const DEFINITION_NOT_FOUND_ERROR_MESSAGE =
  'Definition not found. Please try another word.';
const SOMETHING_WENT_WRONG = 'Something went wrong. Please try again.';

const AddWordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [word, setWord] = useState('');
  const [error, setError] = useState<ReactNode>('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [wordDefinition, setWordDefinition] =
    useState<WordLookupResponse | null>(null);
  const trimmedWord = word.trim();
  const googleDefinitionUrl = `https://www.google.com/search?q=define+${encodeURIComponent(trimmedWord)}`;

  const resetLookup = () => {
    setWord('');
    setError('');
    setIsSearching(false);
    setSuggestions([]);
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
        setSuggestions([]);
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
      void searchDefinition();
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

  const searchDefinition = async (requestedWord = word) => {
    if (isSearching) {
      return;
    }

    const lookupWord = requestedWord.trim().toLowerCase();
    if (!lookupWord) {
      setError(EMPTY_WORD_ERROR_MESSAGE);
      return;
    }

    setError('');
    setWordDefinition(null);
    setIsSearching(true);
    setSuggestions([]);

    try {
      const response = await fetch(`/api/${encodeURIComponent(lookupWord)}`);
      if (!response.ok) {
        if (response.status === 401) {
          setError(
            <>
              Your session has expired.{' '}
              <Link href="/login" className="auth-switch-link">
                Log in
              </Link>{' '}
              again to look up words.
            </>
          );
        } else {
          setError(
            response.status === 404
              ? DEFINITION_NOT_FOUND_ERROR_MESSAGE
              : SOMETHING_WENT_WRONG
          );
        }
        return;
      }
      const data = (await response.json()) as
        | WordLookupResponse
        | WordLookupSuggestionsResponse;
      if ('suggestions' in data) {
        setSuggestions(data.suggestions);
      } else {
        setWordDefinition(data);
      }
    } catch {
      setError(SOMETHING_WENT_WRONG);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setWord(suggestion);
    void searchDefinition(suggestion);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          resetLookup();
          setIsOpen(true);
        }}
        title="Look up a word"
        className="icon-button border-[var(--sage)] bg-[var(--sage-dark)] text-[var(--paper-card)] hover:bg-[var(--sage)] active:bg-[var(--sage)]"
      >
        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {isOpen
        ? createPortal(
            <div className="word-modal-backdrop" onClick={closeModal}>
              <div
                className="word-modal-panel max-w-4xl"
                onClick={event => event.stopPropagation()}
              >
                <div className="flex min-h-0 flex-col">
                  <div className="shrink-0 pr-12">
                    <h3 className="mb-2 whitespace-nowrap text-xl font-semibold text-[var(--ink)] sm:text-2xl">
                      Look up a word
                    </h3>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="word-modal-close"
                    >
                      <X />
                    </button>
                  </div>

                  <div className="word-modal-content scrollbar-none mt-2">
                    <div className="min-w-[calc(var(--app-min-width)-3.625rem)] px-0.5 pt-1">
                      <div className="flex min-w-min items-center gap-2 sm:gap-4">
                        <input
                          type="text"
                          id="searchWord"
                          placeholder="Enter a word"
                          maxLength={128}
                          autoFocus
                          autoComplete="off"
                          value={word}
                          onChange={event => setWord(event.target.value)}
                          onKeyDown={handleInputKeyDown}
                          className="form-input min-w-[12ch] flex-1"
                        />
                        <div className="flex shrink-0 gap-2 sm:pr-1">
                          <button
                            type="button"
                            disabled={isSearching}
                            onClick={() => void searchDefinition()}
                            className="action-button action-button-primary min-w-24 px-3 py-2 text-xs sm:text-sm"
                          >
                            <Search />
                            {isSearching ? 'Searching...' : 'Search'}
                          </button>
                          <a
                            href={googleDefinitionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleGoogleDefinitionClick}
                            className="action-button action-button-secondary px-3 py-2 text-xs sm:text-sm"
                          >
                            <ExternalLink />
                            Google It
                          </a>
                        </div>
                      </div>
                      {error ? (
                        <div className="error-message px-1 pt-3">{error}</div>
                      ) : null}
                      {suggestions.length > 0 ? (
                        <div className="px-3 pt-2">
                          <p className="mb-1.5 text-xs font-bold text-[var(--ink-muted)] sm:text-sm">
                            Did you mean?
                          </p>
                          <div className="flex min-w-max gap-1.5 sm:gap-2">
                            {suggestions.map(suggestion => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => selectSuggestion(suggestion)}
                                className="action-button action-button-secondary px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {isSearching && !error ? (
                        <div className="px-3 pt-1.5 text-xs font-semibold text-[var(--ink-muted)] sm:text-sm">
                          Searching dictionary...
                        </div>
                      ) : null}
                      <div className="flex min-w-max items-center gap-2 px-2.5 pb-1 pt-2.5 text-xs text-[var(--ink-muted)] sm:px-3 sm:text-sm">
                        <span className="flex shrink-0 items-center gap-1">
                          <span className={keycapClass}>Enter</span>
                          <span>Search</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1">
                          <span className={keycapClass}>Shift</span>
                          <span>+</span>
                          <span className={keycapClass}>Enter</span>
                          <span>Google</span>
                        </span>
                      </div>
                      <div className={wordDefinition ? 'mt-4' : undefined}>
                        <AddWordDefinition
                          key={wordDefinition?.word.word}
                          wordDefinition={wordDefinition}
                          onSave={closeModal}
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
