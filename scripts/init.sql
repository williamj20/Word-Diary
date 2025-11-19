DROP TABLE IF EXISTS user_words_list CASCADE;
DROP TABLE IF EXISTS words CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE words (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  word VARCHAR(50) UNIQUE NOT NULL,
  meanings JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_words_list (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_user_word UNIQUE (user_id, word_id)
);

INSERT INTO users (username) VALUES ('test_user');


INSERT INTO words (word, meanings) VALUES
('emaciate',
'[{"partOfSpeech": "verb", "definitions": ["to cause to lose flesh so as to become very thin", "to make feeble", "to waste away physically"]}]'),
('test',
'[{"partOfSpeech": "noun", "definitions": ["a means of testing: such as", "something (such as a series of questions or exercises) for measuring the skill, knowledge, intelligence, capacities, or aptitudes of an individual or group", "a procedure, reaction, or reagent used to identify or characterize a substance or constituent"]},
{"partOfSpeech": "verb", "definitions": ["to put to test or proof : try —often used with out", "to require a doctrinal oath of", "to undergo a test"]},
{"partOfSpeech": "adjective", "definitions": ["of, relating to, or constituting a test", "subjected to, used for, or revealed by testing"]},
{"partOfSpeech": "noun", "definitions": ["an external hard or firm covering (such as a shell) of many invertebrates (such as a foraminifer or a mollusk"]},
{"partOfSpeech": "abbreviation", "definitions": ["Testament"]},
{"partOfSpeech": "noun", "definitions": ["a self-imposed partial or complete ban on the testing of nuclear weapons that is mutually agreed to by countries possessing such weapons"]}]');

INSERT INTO user_words_list (user_id, word_id) VALUES
  ('1', '1'),
  ('1', '2');