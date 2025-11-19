interface Meaning {
  partOfSpeech: string;
  definitions: string[];
}

export interface Word {
  id: string;
  word: string;
  meanings: Meaning[];
  added_at: Date;
}

export interface DictionaryServiceObject {
  fl: string; // functional label
  shortdef: string[]; // short definitions
  hwi: {
    hw: string; // headword
  };
}
