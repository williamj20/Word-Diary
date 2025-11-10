import { DictionaryServiceObject, WordToSearch } from '@/app/lib/definitions';

const response1: DictionaryServiceObject[] = [
  {
    fl: 'verb',
    shortdef: [
      'to cause to lose flesh so as to become very thin',
      'to make feeble',
      'to waste away physically',
    ],
  },
];

const response2: DictionaryServiceObject[] = [
  {
    fl: 'noun',
    shortdef: [
      'a means of testing: such as',
      'something (such as a series of questions or exercises) for measuring the skill, knowledge, intelligence, capacities, or aptitudes of an individual or group',
      'a procedure, reaction, or reagent used to identify or characterize a substance or constituent',
    ],
  },
  {
    fl: 'verb',
    shortdef: [
      'to put to test or proof : try —often used with out',
      'to require a doctrinal oath of',
      'to undergo a test',
    ],
  },
  {
    fl: 'adjective',
    shortdef: [
      'of, relating to, or constituting a test',
      'subjected to, used for, or revealed by testing',
    ],
  },
  {
    fl: 'noun',
    shortdef: [
      'an external hard or firm covering (such as a shell) of many invertebrates (such as a foraminifer or a mollusk)',
    ],
  },
  {
    fl: 'abbreviation',
    shortdef: ['Testament'],
  },
  {
    fl: 'noun',
    shortdef: [
      'a self-imposed partial or complete ban on the testing of nuclear weapons that is mutually agreed to by countries possessing such weapons',
    ],
  },
  {
    fl: 'noun',
    shortdef: [
      'a vehicle (such as an airplane) used for testing new equipment (such as engines or weapons systems); broadly : any device, facility, or means for testing something in development',
    ],
  },
  {
    fl: 'noun',
    shortdef: [
      'a representative case whose outcome is likely to serve as a precedent',
      'a proceeding brought by agreement or on an understanding of the parties to obtain a decision as to the constitutionality of a statute',
    ],
  },
  {
    fl: 'verb',
    shortdef: [
      'to drive (a motor vehicle) in order to evaluate performance',
      'to use or examine (something, such as a computer program) in order to evaluate performance',
    ],
  },
  {
    fl: 'verb',
    shortdef: ['to subject to a flight test'],
  },
];

export const mockDefinition1: WordToSearch = {
  dictionaryEntries: response1,
  word: 'emaciate',
};

export const mockDefinition2: WordToSearch = {
  dictionaryEntries: response2,
  word: 'test',
};
