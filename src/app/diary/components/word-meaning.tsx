import PronunciationButton from '@/app/components/pronunciation-button';
import { MatchKind, type MeaningContent } from '@/app/lib/definitions';

const relationshipClassName = 'mb-2 text-xs text-[var(--ink-muted)] sm:text-sm';

const WordMeaning = ({ meaning }: { meaning: MeaningContent }) => {
  const sourceUrl = `https://www.merriam-webster.com/dictionary/${encodeURIComponent(meaning.definitionHeadword)}`;
  return (
    <section className="min-w-0 border-t border-[var(--brass)]/40 py-4 first:border-t-0 sm:py-5">
      {meaning.matchKind === MatchKind.Derived ? (
        <p className={relationshipClassName}>
          <span className="capitalize">
            {meaning.searchedWordPartOfSpeech ?? 'Word'}
          </span>{' '}
          derived from {meaning.definitionHeadword}
        </p>
      ) : null}
      {meaning.matchKind === MatchKind.Related ? (
        <p className={relationshipClassName}>
          Form of {meaning.definitionHeadword}
        </p>
      ) : null}
      {meaning.matchKind === MatchKind.Variant ? (
        <p className={relationshipClassName}>
          Variant of {meaning.definitionHeadword}
        </p>
      ) : null}
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center justify-between gap-4">
          <h4 className="text-sm font-semibold text-[var(--ink)] sm:text-base">
            Definitions of{' '}
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="auth-switch-link font-semibold"
            >
              {meaning.definitionHeadword}
            </a>
            {meaning.definitionPartOfSpeech ? (
              <>
                <span className="px-2 text-[var(--brass)]">·</span>
                <span className="font-normal italic text-[var(--ink-muted)]">
                  {meaning.definitionPartOfSpeech}
                </span>
              </>
            ) : null}
          </h4>
          <PronunciationButton
            pronunciationWord={meaning.pronunciationWord}
            pronunciationText={meaning.pronunciationText}
            pronunciationUrl={meaning.pronunciationUrl}
          />
        </div>
      </div>
      <ul className="mt-3 list-inside list-disc space-y-1 break-words text-sm font-medium text-[var(--ink-muted)] sm:text-base">
        {meaning.definitions.map((definition, index) => (
          <li key={index}>{definition}</li>
        ))}
      </ul>
    </section>
  );
};
export default WordMeaning;
