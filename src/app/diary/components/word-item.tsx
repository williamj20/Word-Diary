import WordItemDisclosure from '@/app/diary/components/word-item-disclosure';
import WordMeaning from '@/app/components/word-meaning';
import type { UserWordListEntry } from '@/app/lib/word';

const WordItem = ({
  word,
  isOwnDiary,
}: {
  word: UserWordListEntry;
  isOwnDiary: boolean;
}) => {
  const wordDefinition = word.word;
  const addedAtLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(word.addedAt));

  return (
    <article className="relative mt-3 w-full min-w-min max-w-6xl rounded-[1.75rem] border border-[var(--paper-muted)] bg-[var(--paper-card)] px-3 py-2 text-sm font-normal text-[var(--ink)] [background-image:linear-gradient(135deg,var(--paper-card),var(--paper))] sm:px-5 sm:py-2.5 sm:text-base lg:px-6">
      <WordItemDisclosure
        title={wordDefinition.word}
        wordListId={word.id}
        isOwnDiary={isOwnDiary}
        wordLabel={wordDefinition.word}
        addedAtLabel={addedAtLabel}
      >
        <div>
          {wordDefinition.meanings.map(meaning => (
            <WordMeaning key={meaning.id} meaning={meaning} />
          ))}
        </div>
      </WordItemDisclosure>
    </article>
  );
};

export default WordItem;
