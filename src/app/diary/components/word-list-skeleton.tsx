import WordItemSkeleton from '@/app/diary/components/word-item-skeleton';

const WordListSkeleton = ({ rows }: { rows: number }) => {
  return (
    <div className="word-list-container">
      {Array.from({ length: rows }, (_, index) => (
        <WordItemSkeleton key={index} />
      ))}
    </div>
  );
};

export default WordListSkeleton;
