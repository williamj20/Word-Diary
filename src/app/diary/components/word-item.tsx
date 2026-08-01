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
    <article className="word-card mt-3">
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
