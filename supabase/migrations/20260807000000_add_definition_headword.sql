begin;

alter table public.words
  add column definition_headword text;

update public.words
set definition_headword = word;

alter table public.words
  alter column definition_headword set not null,
  add constraint words_definition_headword_canonical_check check (
    definition_headword = lower(btrim(definition_headword))
    and char_length(definition_headword) between 1 and 128
  );

commit;
