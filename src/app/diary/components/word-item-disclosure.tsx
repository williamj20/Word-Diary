'use client';

import DeleteButton from '@/app/diary/components/delete-button';
import { deleteWordFromUserList } from '@/lib/actions/diary';
import clsx from 'clsx';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { ReactNode, useState } from 'react';

const WordItemDisclosure = ({
  title,
  wordListId,
  isOwnDiary,
  wordLabel,
  addedAtLabel,
  children,
}: {
  title: string;
  wordListId: number;
  isOwnDiary: boolean;
  wordLabel: string;
  addedAtLabel: string;
  children: ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const googleDefinitionUrl = `https://www.google.com/search?q=define+${encodeURIComponent(wordLabel)}`;

  return (
    <>
      <div className="flex min-w-max items-center gap-1.5 sm:gap-3">
        <h3 className="word-card-title flex-1">{title}</h3>
        <span className="shrink-0 rounded-full border border-[var(--paper-muted)] bg-[var(--paper)] px-1.5 py-1 text-[0.625rem] font-bold whitespace-nowrap text-[var(--ink-muted)] sm:px-3 sm:text-xs">
          {addedAtLabel}
        </span>
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <a
            href={googleDefinitionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-button h-8 w-8 border-[var(--brass)] bg-[var(--paper-card)] text-[var(--ink-muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)] active:bg-[var(--paper)] active:text-[var(--ink)] sm:h-10 sm:w-10"
          >
            <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
          <button
            type="button"
            title={isExpanded ? 'Hide definitions' : 'Show definitions'}
            onClick={() => setIsExpanded(current => !current)}
            className={clsx(
              'icon-button h-8 w-8 border-[var(--sage)] hover:bg-[var(--sage)] hover:text-[var(--paper-card)] active:bg-[var(--sage)] active:text-[var(--paper-card)] sm:h-10 sm:w-10',
              isExpanded
                ? 'bg-[var(--sage)] text-[var(--paper-card)]'
                : 'bg-[var(--sage-soft)] text-[var(--sage-dark)]'
            )}
          >
            <ChevronDown
              className={clsx(
                'h-3.5 w-3.5 transition-transform duration-200 sm:h-4 sm:w-4',
                isExpanded && 'rotate-180'
              )}
            />
          </button>
          {isOwnDiary ? (
            <DeleteButton
              word={wordLabel}
              deleteAction={deleteWordFromUserList.bind(null, wordListId)}
            />
          ) : null}
        </div>
      </div>

      <div
        data-expanded={isExpanded}
        className="grid grid-rows-[0fr] transition-[grid-template-rows,opacity,margin-top] duration-[220ms] ease-[ease] data-[expanded=true]:mt-[0.2rem] data-[expanded=true]:grid-rows-[1fr]"
      >
        <div
          className={clsx('min-h-0 overflow-hidden', isExpanded && 'min-w-min')}
          inert={!isExpanded}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default WordItemDisclosure;
