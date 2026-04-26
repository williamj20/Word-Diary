import WordItemDisclosure from '@/app/diary/components/word-item-disclosure';
import WordMeaning from '@/app/diary/components/word-meaning';
import { WordFromUserList } from '@/app/lib/definitions';

const WordItem = async ({ word }: { word: WordFromUserList }) => {
  const wordDefinition = word.word;
  const addedAtLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(word.added_at));

  return (
    <article className="word-card mt-6">
      <WordItemDisclosure
        title={wordDefinition.word}
        wordListId={word.id}
        wordLabel={wordDefinition.word}
        addedAtLabel={addedAtLabel}
      >
        <div className="word-card-meanings-container">
          {wordDefinition.meanings.map((meaning, index) => (
            <WordMeaning key={index} meaning={meaning} />
          ))}
        </div>
      </WordItemDisclosure>
    </article>
  );
};

export default WordItem;
