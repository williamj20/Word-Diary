begin;

alter table public.word_meanings
  drop constraint word_meanings_definitions_array_check,
  drop constraint word_meanings_definition_strings_check;
drop function public.valid_definition_strings(jsonb);

create function public.valid_definition_sense(sense jsonb)
returns boolean language sql immutable strict parallel safe
set search_path = ''
as $$
  select (
    jsonb_typeof(sense -> 'text') = 'string'
    and sense ->> 'text' ~ '[^[:space:]]'
    and (
      sense -> 'example' = 'null'::jsonb or (
        jsonb_typeof(sense -> 'example' -> 'text') = 'string'
        and sense -> 'example' ->> 'text' ~ '[^[:space:]]'
        and (not ((sense -> 'example') ? 'attribution') or (
          jsonb_typeof(sense -> 'example' -> 'attribution') = 'string'
          and sense -> 'example' ->> 'attribution' ~ '[^[:space:]]'
        ))
      )
    )
  ) is true;
$$;

create function public.valid_definitions(definitions jsonb)
returns boolean language sql immutable strict parallel safe
set search_path = ''
as $$
  select case when jsonb_typeof(definitions) = 'array' then
    jsonb_array_length(definitions) > 0 and not exists (
      select 1 from jsonb_array_elements(definitions) as sense
      where not public.valid_definition_sense(sense) or (
        sense ? 'dividedSense' and (
          public.valid_definition_sense(sense -> 'dividedSense')
          and jsonb_typeof(sense -> 'dividedSense' -> 'label') = 'string'
          and sense -> 'dividedSense' ->> 'label' ~ '[^[:space:]]'
        ) is not true
      )
    )
  else false end;
$$;

alter table public.word_meanings add constraint word_meanings_definitions_check
  check (public.valid_definitions(definitions));

commit;
