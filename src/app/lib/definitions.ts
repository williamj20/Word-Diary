export interface Meaning {
  part_of_speech: string;
  definitions: string[];
}

export interface Word {
  word: string;
  id: number;
  meanings: Meaning[];
}

export interface WordFromUserList {
  id: number;
  word: Word;
  added_at: Date;
}

// route handler GET response
export interface WordLookupResponse {
  word: Word;
  isInUserList: boolean;
}

export interface DictionaryServiceObject {
  fl: string; // functional label
  shortdef: string[]; // short definitions
  hwi: {
    hw: string; // headword
  };
}
