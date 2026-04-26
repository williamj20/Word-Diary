'use client';

import DeleteButton from '@/app/diary/components/delete-button';
import { deleteWordFromUserList } from '@/app/lib/actions/db';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { ReactNode, useState } from 'react';

const WordItemDisclosure = ({
  title,
  wordListId,
  wordLabel,
  addedAtLabel,
  children,
}: {
  title: string;
  wordListId: number;
  wordLabel: string;
  addedAtLabel: string;
  children: ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const deleteWord = deleteWordFromUserList.bind(null, wordListId);

  return (
    <>
      <div className="word-card-content-container">
        <h3 className="word-card-title">{title}</h3>
        <div className="word-card-button-container">
          <span className="word-card-span">{addedAtLabel}</span>
          <button
            type="button"
            onClick={() => setIsExpanded(current => !current)}
            className={clsx(
              'icon-button word-card-toggle-button',
              isExpanded && 'word-card-toggle-button-expanded'
            )}
          >
            <ChevronDown
              className={clsx(
                'h-5 w-5 transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
            />
          </button>
          <DeleteButton word={wordLabel} deleteAction={deleteWord} />
        </div>
      </div>

      <div data-expanded={isExpanded} className="word-card-details-shell">
        <div className="word-card-details-inner">{children}</div>
      </div>
    </>
  );
};

export default WordItemDisclosure;
