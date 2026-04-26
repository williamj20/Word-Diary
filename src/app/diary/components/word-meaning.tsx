import { Meaning } from '@/app/lib/definitions';

const WordMeaning = async ({ meaning }: { meaning: Meaning }) => {
  return (
    <section className="word-card-meanings">
      <div className="word-card-meanings-part-of-speech">
        {meaning.part_of_speech}
      </div>
      <ul className="word-card-meanings-definitions">
        {meaning.definitions.map((definition, defIndex) => (
          <li key={defIndex}>{definition}</li>
        ))}
      </ul>
    </section>
  );
};

export default WordMeaning;
