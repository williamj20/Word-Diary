import DeleteButton from '@/app/(diary)/components/delete-button';
import { deleteWordFromUserList } from '@/app/lib/actions/db';
import { WordFromUserList } from '@/app/lib/definitions';

const WordItem = async ({ word }: { word: WordFromUserList }) => {
  const deleteWord = deleteWordFromUserList.bind(null, 1, word.id);
  const wordDefinition = word.word;
  return (
    <div className="w-full max-w-7xl px-4 py-3 mt-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border-l-green-400 shadow-green-200/50 border-l-8 text-lg font-medium">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{wordDefinition.word}</h3>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-green-300 px-2 py-1 rounded-full">
            {new Date(word.added_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <DeleteButton word={wordDefinition.word} deleteAction={deleteWord} />
        </div>
      </div>
      <div className="flex flex-start gap-4">
        {wordDefinition.meanings.map((meaning, index) => (
          <div key={index} className="flex-1 max-w-fit p-2">
            <h3 className="text-xl font-semibold">{meaning.part_of_speech}</h3>
            <ul className="list-disc list-inside">
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
