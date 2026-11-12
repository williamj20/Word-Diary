'use client';

import type { Pronunciation } from '@/app/lib/definitions';
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
      className="inline-flex max-w-full shrink-0 overflow-x-auto align-middle [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
        className="action-button action-button-secondary min-h-10 shrink-0 gap-1 px-3 py-1.5 text-xs font-medium whitespace-nowrap disabled:opacity-100 sm:text-sm"
      >
        <span className="font-semibold">{pronunciationWord}</span>
        {pronunciationText ? (
          <>
            <span className="text-[var(--brass)]">·</span>
            <span>{pronunciationText}</span>
          </>
        ) : null}
        <Icon className="ml-0.5 h-4 w-4 shrink-0" />
      </button>
    </span>
  );
};
export default PronunciationButton;
