'use client';

export type StopPlayback = () => void;

// All pronunciation buttons use this function to stop the current recording
// before starting a new one, so recordings never play over each other.
let stopCurrentPlayback: StopPlayback | null = null;

export function playPronunciation(url: string): StopPlayback {
  stopCurrentPlayback?.();

  const audio = new Audio();
  let stopped = false;

  function stop() {
    if (stopped) {
      return;
    }
    stopped = true;
    audio.onended = null;
    audio.onerror = null;

    // Pause the audio, then clear its source to cancel any unfinished download.
    audio.pause();
    audio.removeAttribute('src');
    audio.load();

    if (stopCurrentPlayback === stop) {
      stopCurrentPlayback = null;
    }
  }

  function fail(error: unknown) {
    // Stopping audio can cause play() to report an error afterward.
    // Ignore errors that arrive after this recording has already stopped.
    if (stopped) {
      return;
    }
    stop();
    console.error('Unable to play pronunciation:', url, error);
  }

  audio.onended = stop;
  audio.onerror = () => fail(audio.error);
  audio.preload = 'none';
  audio.src = url;
  stopCurrentPlayback = stop;

  // Call play() directly from the button click.
  try {
    void audio.play().catch(fail);
  } catch (error) {
    fail(error);
  }

  return stop;
}
