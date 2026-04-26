import AddWord from '@/app/diary/components/add-word';
import WordList from '@/app/diary/components/word-list';
import { redirectToSignupIfNotLoggedIn } from '@/app/lib/utils';

const DiaryPage = async () => {
  await redirectToSignupIfNotLoggedIn();

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
