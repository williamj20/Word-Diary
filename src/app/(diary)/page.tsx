import AddWord from '@/app/(diary)/components/add-word';
import WordList from '@/app/(diary)/components/word-list';

const DiaryPage = async () => {
  return (
    <main>
      <AddWord />
      <div className="mt-12">
        <WordList />
      </div>
    </main>
  );
};

export default DiaryPage;
