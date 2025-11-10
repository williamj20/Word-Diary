import { Word } from '@/app/lib/definitions';

export default function WordItem({ word }: { word: Word }) {
  return (
    <div
      key={word.id}
      className="w-full max-w-6xl rounded-lg p-6 border border-gray-200"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold">{word.word}</h3>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
            {word.dateAdded.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <p>{word.definition}</p>
      </div>
    </div>
  );
}
