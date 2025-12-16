import AddWord from '@/app/(diary)/components/add-word';
import WordList from '@/app/(diary)/components/word-list';

const DiaryPage = async () => {
  return (
    <main>
      <AddWord />
      <WordList />
    </main>
  );
};

export default DiaryPage;
