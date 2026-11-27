import PronunciationButton from '@/components/pronunciation-button';
import { MatchKind } from '@/lib/word';
import type { Definition, MeaningContent } from '@/types/word';

const relationshipClassName = 'mb-2 text-xs text-[var(--ink-muted)] sm:text-sm';

const UsageExample = ({ example }: { example: Definition['example'] }) =>
  example ? (
    <figure className="mt-1 ml-3 border-l-2 border-[var(--paper-muted)] pl-3">
      <blockquote className="italic">{example.text}</blockquote>
      {example.attribution ? (
        <figcaption className="mt-1 text-xs sm:text-sm">
          — {example.attribution}
        </figcaption>
      ) : null}
    </figure>
  ) : null;

const WordMeaning = ({ meaning }: { meaning: MeaningContent }) => {
  const sourceUrl = `https://www.merriam-webster.com/dictionary/${encodeURIComponent(meaning.definitionHeadword)}`;
  return (
    <section className="min-w-0 border-t border-[var(--brass)]/40 py-4 wrap-anywhere first:border-t-0 sm:py-5">
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
      <div className="flex w-max max-w-full flex-wrap items-center gap-1 sm:gap-3">
        <h4 className="text-xs font-semibold text-[var(--ink)] sm:text-base">
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
              <span className="px-1 text-[var(--brass)] sm:px-2">·</span>
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
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-normal text-[var(--ink-muted)] sm:text-base">
        {meaning.definitions.map((definition, index) => (
          <li key={index}>
            {definition.text}
            <UsageExample example={definition.example} />
            {definition.dividedSense ? (
              <div className="mt-2">
                <span className="italic">{definition.dividedSense.label}</span>{' '}
                {definition.dividedSense.text}
                <UsageExample example={definition.dividedSense.example} />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
};
export default WordMeaning;
