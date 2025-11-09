import { BookOpenText } from 'lucide-react';
import AddWord from './ui/add-word';

export default function Home() {
  return (
    <div>
      <div className="flex gap-3 items-center mt-3 justify-center">
        <BookOpenText className="w-10 h-10" />
        <h1 className="font-semibold text-5xl">Word Diary</h1>
      </div>
      <AddWord />
    </div>
  );
}
