'use client';

import type { Pronunciation } from '@/app/lib/word';
import {
  playPronunciation,
  type StopPlayback,
} from '@/app/lib/pronunciation-player';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef } from 'react';

const PronunciationButton = ({
  pronunciationWord,
  pronunciationText,
  pronunciationUrl,
}: Pronunciation) => {
  const stopPlayback = useRef<StopPlayback | null>(null);
  useEffect(
    () => () => stopPlayback.current?.(),
    [pronunciationWord, pronunciationText, pronunciationUrl]
  );
  if (!pronunciationUrl && !pronunciationText) {
    return null;
  }
  const title = pronunciationUrl
    ? `Play pronunciation of ${pronunciationWord}`
    : `Audio unavailable for ${pronunciationWord}`;
  const Icon = pronunciationUrl ? Volume2 : VolumeX;
  return (
    <span
      className="inline-flex w-max max-w-full align-middle"
      onClick={event => event.stopPropagation()}
    >
      <button
        type="button"
        title={title}
        disabled={!pronunciationUrl}
        onClick={() => {
          if (pronunciationUrl) {
            stopPlayback.current = playPronunciation(pronunciationUrl);
          }
        }}
        className="action-button action-button-secondary min-h-9 max-w-full gap-1 rounded-[1.25rem] px-1.5 py-1 text-xs font-medium whitespace-normal wrap-anywhere disabled:opacity-100 sm:min-h-10 sm:px-3 sm:py-1.5 sm:text-sm"
      >
        <span className="min-w-0">
          <span className="font-semibold">{pronunciationWord}</span>
          {pronunciationText ? (
            <>
              {' '}
              <span className="text-[var(--brass)]">·</span>{' '}
              <span>{pronunciationText}</span>
            </>
          ) : null}
        </span>
        <Icon className="ml-0.5 h-4 w-4 shrink-0" />
      </button>
    </span>
  );
};
export default PronunciationButton;
