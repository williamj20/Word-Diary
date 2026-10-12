import WordItemDisclosure from '@/app/diary/components/word-item-disclosure';
import WordMeaning from '@/app/diary/components/word-meaning';
import { UserWordListEntry } from '@/app/lib/definitions';

const WordItem = ({ word }: { word: UserWordListEntry }) => {
  const wordDefinition = word.word;
  const addedAtLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(word.addedAt));

  return (
    <article className="relative mt-3 w-full max-w-6xl rounded-[1.75rem] border border-[var(--brass)] bg-[var(--paper-card)] px-3.5 py-2 text-sm font-medium text-[var(--ink)] [background-image:linear-gradient(135deg,var(--paper-card),var(--paper))] sm:px-5 sm:py-2.5 sm:text-base lg:px-6">
      <WordItemDisclosure
        title={wordDefinition.word}
        wordListId={word.id}
        wordLabel={wordDefinition.word}
        addedAtLabel={addedAtLabel}
      >
        <div className="word-card-meanings-container">
          {wordDefinition.meanings.map(meaning => (
            <WordMeaning key={meaning.id} meaning={meaning} />
          ))}
        </div>
      </WordItemDisclosure>
    </article>
  );
};

export default WordItem;
