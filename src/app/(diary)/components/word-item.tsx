import { WordFromUserList } from '@/app/lib/definitions';
import { Trash2 } from 'lucide-react';

const WordItem = async ({ word }: { word: WordFromUserList }) => {
  return (
    <div className="w-full max-w-7xl px-4 py-3 mt-6 rounded-lg border border-gray-200 text-lg font-medium">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold">{word.word}</h3>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
            {new Date(word.added_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <button className="p-2 rounded-lg text-red-800 bg-red-200 hover:bg-red-300 active:bg-red-400 transition-all shadow-md enabled:hover:shadow-lg">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-start gap-4">
        {word.meanings.map((meaning, index) => (
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
