export interface Meaning {
  part_of_speech: string;
  definitions: string[];
}

export interface Word {
  id: string;
  word: string;
  meanings: Meaning[];
  added_at: Date;
}

// Response from DB lookup
export interface WordDAO {
  word: Word;
}

// route handler GET response
export interface WordLookupResponse extends Word {
  isInUserList: boolean;
}

export interface DictionaryServiceObject {
  fl: string; // functional label
  shortdef: string[]; // short definitions
  hwi: {
    hw: string; // headword
  };
}
