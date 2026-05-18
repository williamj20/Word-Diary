create extension if not exists pg_trgm with schema extensions;

set search_path = public, extensions;

create index if not exists idx_words_word_trgm
  on public.words using gin (word extensions.gin_trgm_ops);

create index if not exists idx_word_meanings_word_id
  on public.word_meanings(word_id);

create index if not exists idx_word_meaning_definitions_meaning_order
  on public.word_meaning_definitions(meaning_id, definition_order);
