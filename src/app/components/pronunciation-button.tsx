'use client';

import type { WordDefinition } from '@/app/lib/definitions';
import {
  playPronunciation,
  type StopPlayback,
} from '@/app/lib/pronunciation-player';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef } from 'react';

type PronunciationButtonProps = Pick<
  WordDefinition,
  'word' | 'definitionHeadword' | 'pronunciationUrl'
>;

const PlaybackButton = ({
  definitionHeadword,
  pronunciationUrl,
}: PronunciationButtonProps) => {
  const stopPlayback = useRef<StopPlayback | null>(null);

  useEffect(() => {
    return () => stopPlayback.current?.();
  }, []);

  const title = pronunciationUrl
    ? `Play pronunciation of ${definitionHeadword}`
    : 'Pronunciation unavailable';
  const Icon = pronunciationUrl ? Volume2 : VolumeX;

  const handlePlay = () => {
    if (pronunciationUrl) {
      stopPlayback.current = playPronunciation(pronunciationUrl);
    }
  };

  return (
    <span
      className="inline-flex shrink-0 align-middle"
      title={title}
      onClick={event => event.stopPropagation()}
    >
      <button
        type="button"
        title={title}
        disabled={!pronunciationUrl}
        onClick={handlePlay}
        className="icon-button h-7 w-7 border-[var(--brass)] bg-[var(--paper-card)] p-1 text-[var(--ink-muted)] enabled:hover:bg-[var(--paper)] enabled:hover:text-[var(--ink)] enabled:active:bg-[var(--paper)] enabled:active:text-[var(--ink)] sm:h-8 sm:w-8 sm:p-1.5"
      >
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
    </span>
  );
};

const PronunciationButton = (props: PronunciationButtonProps) => (
  // Changing the displayed word or recording stops playback.
  <PlaybackButton key={`${props.word}:${props.pronunciationUrl}`} {...props} />
);

export default PronunciationButton;
