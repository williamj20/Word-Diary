import { BookOpenText } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex items-center flex-col">
      <div className="flex gap-3 items-center mt-3">
        <BookOpenText className="w-10 h-10" />
        <h1 className="font-semibold text-5xl">Word Diary</h1>
      </div>
    </div>
  );
}
