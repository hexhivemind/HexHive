declare interface ListingData {
  _id?: string; // Set by database, will be private, internal
  id: string;
  title: string;
  description: string;
  author: string;
  slug?: string;
  rating?: number;
}

declare type SupportedBaseRoms = 'Fire Red' | 'Emerald'; // | 'Ruby'
declare type SupportedBaseRomVersions = 'v1.0' | 'v1.1';
declare type SupportedBaseRomRegions =
  | 'English'
  | 'French'
  | 'German'
  | 'Italian'
  | 'Japanese'
  | 'Spanish';

// Per NO-INTRO (removed debug, box), these are known revisions
// Realistically, almost none of these will be used, but oh well
// - Emerald
//  - US/EUR
//  - France
//  - Germany
//  - Italy
//  - Japan
//  - Spain

// - Fire Red / Leaf Green
//  - US/EUR v1, v1.1
//  - France
//  - Germany
//  - Italy
//  - Japan v1, v1.1
//  - Spain

// - Ruby/Sapphire
//  - US/EUR v1, v1.1
//  - France v1, v1.1
//  - Germany v1, v1.1
//  - Italy v1, v1.1
//  - Japan v1, v1.1
//  - Spain v1, v1.1

declare interface RomhackData extends ListingData {
  filename: string;
  baseRom: SupportedBaseRoms;
  baseRomVersion: SupportedBaseRomVersions;
  baseRomRegion: SupportedBaseRomRegions;
  release: string; // User-defined version
  lastUpdated?: luxon.DateTime; // TODO: will come from db, won't be optional

  // TODO: Features, completion status, binary/decomp, etc
  releaseDate?: luxon.DateTime;
  boxart?: string[];
  screenshots?: string[];
  trailer?: string[];
  tags?: string[]; // User-defined tag cloud
  flags?: string[]; // Internal/Moderator applied, flags like mature content

  changelog?: {
    entries: { [version: string]: string };
  };
}

// Placeholder data for all types, to show that an item was deleted.
declare interface DeletedEntry {
  _id: string;
  deleted: boolean;
  reason?: string; // Optional for now, but later server will provide a reason.
}

declare type ListEntry<T extends ListingData> = T | DeletedEntry;
