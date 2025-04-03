declare interface ListingData {
  _id?: string; // Set by database, will be private, internal
  id: string;
  title: string;
  description: string;
  author: string;
  slug?: string;
  rating?: number;
}

declare type SupportedBaseRom = 'Fire Red' | 'Emerald'; // | 'Ruby'
declare type SupportedBaseRomVersion = 'v1.0' | 'v1.1'; // TODO: Alias "squirrels"
declare type SupportedBaseRomRegion =
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
  baseRom: SupportedBaseRom;
  baseRomVersion: SupportedBaseRomVersion;
  baseRomRegion: SupportedBaseRomRegion;
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

// A "Hive" is like a collection/folder/repository, etc
declare interface AssetHive extends ListingData {
  fileSize: number;
  fileCount: number;
  fileList: string[];
  targetedRoms: SupportedBaseRom[];
}

// Thoughts:
// Sprites are broken into several categories, e.g:
//
// Overworld:
//  - Pokemon (followers, overworld for land, surfing)
//  - Trainers/NPCs (walking, running, biking, fishing, surfing, surf+fishing, vs seeker, bike+seeker)
// Battle:
//  - Trainer (back, front, variants of either)
//  - Pokemon (front, back, shinies of both, animated if Emerald)
//  - Attack particle effects
//

type HumanMovement =
  | 'Walk'
  | 'Run'
  | 'Bike'
  | 'Swim'
  | 'Surf'
  | 'Fish'
  | 'Dive'
  | 'Vs Seeker'
  | 'Bike Seeker'
  | 'Surf Fish';

type SpriteVariant = {
  Overworld: {
    Pokemon: { variant: 'Follower' | 'Land' | 'Surfing' };
    NPC: { variant: HumanMovement };
    Player: { variant: HumanMovement };
  };
  Battle: {
    Trainer: { variant: 'Back' | 'Front' };
    Pokemon: { variant: 'Front' | 'Back' };
    Attack: { variant: undefined };
  };
};

// Acceptable values for the `variant` field
type SpriteVariantValue<V> =
  | V
  | V[]
  | {
      default?: V[];
      shiny?: V[];
      animated?: V[];
      animatedShiny?: V[];
    };

// Discriminated union: every valid type/subtype combo with resolved variant typing
type SpriteUnionType = {
  [T in keyof SpriteVariant]: {
    [S in keyof SpriteVariant[T]]: {
      type: T;
      subtype: S;
      variant: SpriteVariantValue<SpriteVariant[T][S]['variant']>;
    };
  }[keyof SpriteVariant[T]];
}[keyof SpriteVariant];

// Final interface: spriteKind resolves correctly based on type + subtype
declare interface SpritesData extends AssetHive {
  category: string; // Overworld (OW), Trainer, Battle Sprite, Pokemon, etc
  spriteKind: SpriteUnionType;
}

/*
 * Scripts
 */
declare interface ScriptsData {
  // Only scripts care about v1.0 vs v1.1
  targetedVersions: SupportedBaseRomVersion[];
}

/*
 * SOUND
 */
declare type SoundCategory = 'Cry' | 'Jingle' | 'SFX' | 'Song';

declare interface SoundData {
  category: SoundCategory;
}

// Placeholder data for all types, to show that an item was deleted.
declare interface DeletedEntry {
  _id: string;
  deleted: boolean;
  reason?: string; // Optional for now, but later server will provide a reason.
}

declare type ListEntry<T extends ListingData> = T | DeletedEntry;
