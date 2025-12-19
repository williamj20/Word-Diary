import DeleteButton from '@/app/(diary)/components/delete-button';
import { deleteWordFromUserList } from '@/app/lib/actions/db';
import { WordFromUserList } from '@/app/lib/definitions';

const WordItem = async ({ word }: { word: WordFromUserList }) => {
  const deleteWord = deleteWordFromUserList.bind(null, 1, word.id);
  const wordDefinition = word.word;
  return (
    <div className="word-card mt-6 from-green-50 to-emerald-100 border-l-green-400 shadow-green-200/50">
      <div className="word-card-content-container">
        <h3 className="word-card-title">{wordDefinition.word}</h3>
        <div className="word-card-button-container">
          <span className="bg-green-300 word-card-span">
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
            <h3 className="word-card-meanings-part-of-speech">
              {meaning.part_of_speech}
            </h3>
            <ul className="word-card-meanings-definitions">
              {meaning.definitions.map((definition, defIndex) => (
                <li key={defIndex}>{definition}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordItem;
