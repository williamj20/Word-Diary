begin;

-- Fresh databases only: intentionally no legacy backfill or compatibility layer.
alter table public.words
  drop column definition_headword,
  drop column pronunciation_url;

-- Distinguish the definition source's part of speech from the searched word's.
alter table public.word_meanings
  rename column part_of_speech to definition_part_of_speech;

alter table public.word_meanings
  -- Renamed existing column: the definition source's part of speech; NULL if absent.
  alter column definition_part_of_speech drop not null,
  drop constraint word_meanings_part_of_speech_check,
  add constraint word_meanings_definition_part_of_speech_check check (
    definition_part_of_speech is null or (
      definition_part_of_speech ~ '[^[:space:]]' and char_length(definition_part_of_speech) <= 64
    )
  ),
  -- Word or phrase supplying these definitions, e.g. rely for a search of relied.
  add column definition_headword text not null,
  -- Relationship of the searched word to this source: exact headword, inflection,
  -- spelling variant, derived word, nested phrase, or otherwise related entry.
  add column match_kind text not null,
  -- Part of speech explicitly associated with the searched form; NULL if absent.
  -- For voluminously this is adverb, while the source voluminous is an adjective.
  add column searched_word_part_of_speech text,
  -- Word represented by the selected audio or written pronunciation, e.g. went
  -- even when definitions come from go. Falls back to the source headword if absent.
  add column pronunciation_word text not null,
  -- Dictionary-provided notation for the selected pronunciation; NULL if absent.
  add column pronunciation_text text,
  -- Full URL of the selected recording; NULL when no usable recording is supplied.
  add column pronunciation_url text,
  add constraint word_meanings_headword_check check (definition_headword ~ '[^[:space:]]'),
  add constraint word_meanings_match_kind_check check (
    match_kind in ('exact', 'inflection', 'variant', 'derived', 'phrase', 'related')
  ),
  add constraint word_meanings_searched_word_part_of_speech_check check (
    searched_word_part_of_speech is null or (
      searched_word_part_of_speech ~ '[^[:space:]]' and char_length(searched_word_part_of_speech) <= 64
    )
  ),
  add constraint word_meanings_pronunciation_word_check check (pronunciation_word ~ '[^[:space:]]'),
  add constraint word_meanings_pronunciation_text_check check (
    pronunciation_text is null or pronunciation_text ~ '[^[:space:]]'
  ),
  add constraint word_meanings_pronunciation_url_check check (
    pronunciation_url is null or pronunciation_url ~ '[^[:space:]]'
  );

-- CHECK constraints cannot contain subqueries. This immutable helper validates
-- every JSONB array member as a nonblank string.
create function public.valid_definition_strings(definitions jsonb)
returns boolean language sql immutable strict parallel safe
set search_path = ''
as $$
  select case when jsonb_typeof(definitions) = 'array' then
    jsonb_array_length(definitions) > 0 and not exists (
      select 1 from jsonb_array_elements(definitions) as definition
      where jsonb_typeof(definition) <> 'string'
        or (definition #>> '{}') !~ '[^[:space:]]'
    )
  else false end;
$$;

alter table public.word_meanings
  add constraint word_meanings_definition_strings_check check (public.valid_definition_strings(definitions));

comment on column public.word_meanings.pronunciation_word is
  'Actual pronunciation word, or the definition headword when pronunciation is unavailable.';

commit;
