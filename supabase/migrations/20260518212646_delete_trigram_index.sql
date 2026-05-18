-- Index is likely not going to be used, so we can drop it to save storage and improve write performance.
drop index if exists public.idx_words_word_trgm;

drop extension if exists pg_trgm;