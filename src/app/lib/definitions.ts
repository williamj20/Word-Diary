export interface Meaning {
  part_of_speech: string;
  definitions: string[];
}

export interface Word {
  word: string;
  meanings: Meaning[];
}

export interface WordFromUserList extends Word {
  id: string;
  added_at: Date;
}

// Response from DB lookup from user list
export interface WordDAO {
  word: WordFromUserList;
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
