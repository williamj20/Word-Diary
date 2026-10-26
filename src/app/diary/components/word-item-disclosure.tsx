'use client';

import PronunciationButton from '@/app/components/pronunciation-button';
import DeleteButton from '@/app/diary/components/delete-button';
import { deleteWordFromUserList } from '@/app/lib/actions/db';
import clsx from 'clsx';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { ReactNode, useState } from 'react';

const WordItemDisclosure = ({
  title,
  wordListId,
  isOwnDiary,
  wordLabel,
  definitionHeadword,
  pronunciationUrl,
  addedAtLabel,
  children,
}: {
  title: string;
  wordListId: number;
  isOwnDiary: boolean;
  wordLabel: string;
  definitionHeadword: string;
  pronunciationUrl: string | null;
  addedAtLabel: string;
  children: ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const googleDefinitionUrl = `https://www.google.com/search?q=define+${encodeURIComponent(wordLabel)}`;

  return (
    <>
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center gap-2 sm:gap-3">
          <div className="flex flex-1 items-center gap-1.5 sm:gap-2">
            <PronunciationButton
              word={wordLabel}
              definitionHeadword={definitionHeadword}
              pronunciationUrl={pronunciationUrl}
            />
            <h3 className="word-card-title whitespace-nowrap">{title}</h3>
          </div>
          <span className="shrink-0 rounded-full border border-[var(--brass)] bg-[var(--paper)] px-2 py-1 text-[0.625rem] font-bold whitespace-nowrap text-[var(--ink-muted)] sm:px-3 sm:text-xs">
            {addedAtLabel}
          </span>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <a
              href={googleDefinitionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-button border-[var(--brass)] bg-[var(--paper-card)] text-[var(--ink-muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)] active:bg-[var(--paper)] active:text-[var(--ink)]"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => setIsExpanded(current => !current)}
              className={clsx(
                'icon-button border-[var(--sage)] hover:bg-[var(--sage)] hover:text-[var(--paper-card)] active:bg-[var(--sage)] active:text-[var(--paper-card)]',
                isExpanded
                  ? 'bg-[var(--sage)] text-[var(--paper-card)]'
                  : 'bg-[var(--sage-soft)] text-[var(--sage-dark)]'
              )}
            >
              <ChevronDown
                className={clsx(
                  'h-4 w-4 transition-transform duration-200',
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
      </div>

      <div
        data-expanded={isExpanded}
        className="grid grid-rows-[0fr] transition-[grid-template-rows,opacity,margin-top] duration-[220ms] ease-[ease] data-[expanded=true]:mt-[0.2rem] data-[expanded=true]:grid-rows-[1fr]"
      >
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
    </>
  );
};

export default WordItemDisclosure;
