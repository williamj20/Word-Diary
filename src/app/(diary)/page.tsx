import AddWord from '@/app/(diary)/components/add-word';
import WordList from '@/app/(diary)/components/word-list';

export default async function Page() {
  return (
    <main>
      <AddWord />
      <WordList />
    </main>
  );
}
