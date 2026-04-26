import DeleteButton from '@/app/diary/components/delete-button';
import { deleteWordFromUserList } from '@/app/lib/actions/db';
import { WordFromUserList } from '@/app/lib/definitions';

const WordItem = async ({ word }: { word: WordFromUserList }) => {
  const deleteWord = deleteWordFromUserList.bind(null, word.id);
  const wordDefinition = word.word;
  return (
    <article className="word-card mt-6">
      <div className="word-card-content-container">
        <h3 className="word-card-title">{wordDefinition.word}</h3>
        <div className="word-card-button-container">
          <span className="word-card-span">
            {new Date(word.added_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <DeleteButton word={wordDefinition.word} deleteAction={deleteWord} />
        </div>
      </div>
      <div className="word-card-meanings-container">
        {wordDefinition.meanings.map((meaning, index) => (
          <div key={index} className="word-card-meanings">
            <div className="word-card-meanings-part-of-speech">
              {meaning.part_of_speech}
            </div>
            <ul className="word-card-meanings-definitions">
              {meaning.definitions.map((definition, defIndex) => (
                <li key={defIndex}>{definition}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
};

export default WordItem;
