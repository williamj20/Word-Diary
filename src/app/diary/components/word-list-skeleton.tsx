import WordItemSkeleton from '@/app/diary/components/word-item-skeleton';

const WORD_LIST_SKELETON_ROWS = 6;

const WordListSkeleton = () => {
  return (
    <div className="word-list-container">
      {Array.from({ length: WORD_LIST_SKELETON_ROWS }, (_, index) => (
        <WordItemSkeleton key={index} />
      ))}
    </div>
  );
};

export default WordListSkeleton;
