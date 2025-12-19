DROP TABLE IF EXISTS word_meaning_definitions CASCADE;
DROP TABLE IF EXISTS word_meanings;
DROP TABLE IF EXISTS user_words_list CASCADE;
DROP TABLE IF EXISTS words CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE words (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  word VARCHAR(50) UNIQUE NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_words_list (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_user_word UNIQUE (user_id, word_id)
);

CREATE TABLE word_meanings (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  part_of_speech VARCHAR(50)
);

CREATE TABLE word_meaning_definitions (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  meaning_id INTEGER NOT NULL REFERENCES word_meanings(id) ON DELETE CASCADE,
  definition TEXT NOT NULL,
  definition_order INTEGER NOT NULL
);

INSERT INTO users (username, id) VALUES ('test_user', '1');

INSERT INTO words (word) VALUES
('run'),
('bright'),
('cast');

INSERT INTO word_meanings (word_id, part_of_speech) VALUES
(1, 'verb'),
(1, 'noun');

INSERT INTO word_meanings (word_id, part_of_speech) VALUES
(2, 'adjective');

INSERT INTO word_meanings (word_id, part_of_speech) VALUES
(3, 'verb'),
(3, 'noun');

INSERT INTO word_meaning_definitions (meaning_id, definition, definition_order) VALUES
(1, 'move swiftly on foot', 1),
(1, 'operate or manage', 2),
(1, 'flow or cause to flow', 3);

INSERT INTO word_meaning_definitions (meaning_id, definition, definition_order) VALUES
(2, 'an act or spell of running', 1),
(2, 'a continuous stretch or period of time', 2);

INSERT INTO word_meaning_definitions (meaning_id, definition, definition_order) VALUES
(3, 'giving out or reflecting a lot of light', 1),
(3, 'intelligent and quick-witted', 2);

INSERT INTO word_meaning_definitions (meaning_id, definition, definition_order) VALUES
(4, 'throw something forcefully', 1),
(4, 'assign a role to an actor', 2);

INSERT INTO word_meaning_definitions (meaning_id, definition, definition_order) VALUES
(5, 'the actors in a play or movie', 1);

INSERT INTO user_words_list (user_id, word_id) VALUES
  ('1', '1'),
  ('1', '2'),
  ('1', '3');
