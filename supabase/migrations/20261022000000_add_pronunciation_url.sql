begin;

alter table public.words
  add column pronunciation_url text;

comment on column public.words.pronunciation_url is
  'Merriam-Webster MP3 URL for definition_headword; null when no usable recording was supplied.';

commit;
