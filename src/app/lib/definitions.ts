export interface Word {
  id: string;
  word: string;
  definition: string;
  dateAdded: Date;
}

export interface DictionaryServiceObject {
  fl: string; // functional label
  shortdef: string[]; // short definitions
  hwi: {
    hw: string; // headword
  };
}
