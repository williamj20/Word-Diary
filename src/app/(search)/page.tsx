import AddWord from '@/app/ui/add-word';
import WordList from '@/app/ui/word-list';

const initialWords = [
  {
    id: '1',
    word: 'Serendipity',
    definition:
      'The occurrence of finding pleasant or valuable things by chance',
    dateAdded: new Date('2024-11-01'),
  },
  {
    id: '2',
    word: 'Serendipity',
    definition:
      'The occurrence of finding pleasant or valuable things by chance',
    dateAdded: new Date('2024-11-01'),
  },
];

export default function Page() {
  return (
    <main>
      <AddWord />
      <WordList initialWords={initialWords} />
    </main>
  );
}
