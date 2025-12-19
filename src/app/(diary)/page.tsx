import AddWord from '@/app/(diary)/components/add-word';
import WordList from '@/app/(diary)/components/word-list';

const DiaryPage = async () => {
  return (
    <div className="space-y-10">
      <AddWord />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone-600">
            Your saved words
          </h2>
        </div>

        <WordList />
      </section>
    </div>
  );
};

export default DiaryPage;
