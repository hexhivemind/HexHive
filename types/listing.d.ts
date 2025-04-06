declare interface ListingData {
  _id?: string; // Set by database, will be private, internal
  id: string; // Optional? Auto-incrementing unique id used for route navigation if slug not set?
  title: string;
  description: string;
  author: string;
  slug?: string; // User set id for route navigation, unique.
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

type HumanMovement =
  | 'Biking'
  | 'Dive'
  | 'Fishing'
  | 'Fishing (Surfing)'
  | 'Running'
  | 'Surfing'
  | 'Swimming'
  | 'Vs Seeker'
  | 'Vs Seeker (Biking)'
  | 'Walking';
// | string? or misc/other?

// TODO: Name more later, or make it a string
type EnvironmentVariant =
  | 'Building'
  | 'Cave'
  | 'Forest'
  | 'Grass'
  | 'Gym/League'
  | 'Indoors'
  | 'Jungle'
  | 'Lab'
  | 'Link Room'
  | 'Sky'
  | 'Tundra'
  | 'Underwater'
  | 'Volcanic'
  | 'Water (Surface)'
  | string;

type UserDefined = {
  variant: string;
};

type SpriteVariant = {
  Battle: {
    Attack: { variant: undefined };
    Background: {
      variant: EnvironmentVariant;
    };
    Pokeball: { variant: string }; // TODO: Define list of Pokeballs, ending with | string
    Pokemon: { variant: 'Back' | 'Front' };
    Trainer: { variant: 'Back' | 'Front' };
    Other: UserDefined;
  };

  Environment: {
    // Interactable (such as HM Trees)
    Object: { variant: 'HM' | 'Item' };

    // Vignette that shows before certain POIs:
    Preview: {
      variant: EnvironmentVariant;
    };

    // Map tiles (ground, buildings, trees, etc)
    Tiles: {
      variant: EnvironmentVariant;
    };

    Other: UserDefined;
  };

  Menu: {
    // Items always look the same in every use
    Item: { variant: undefined };

    // Do we track for Emote variants in Dialogue?
    Mugshots: { variant: 'Battle' | 'Dialogue' };

    // Unsure where these are used, or if they're the same sprite
    // These should appear when starting a game (+ one for the rival)
    // These also appear when looking at your Trainer Card, or the Hall of Fame
    Player: { variant: 'New Game' | 'Trainer Card' };

    // Party/Box sprite
    // Is this variant even necessary?
    Pokemon: { variant: 'Animated' | 'Static' };

    Other: UserDefined;
  };

  Overworld: {
    NPC: { variant: HumanMovement };
    Player: { variant: HumanMovement };
    Pokemon: { variant: 'Follower' | 'Land' | 'Surfing' };
    Other: UserDefined;
  };

  UI: {
    Bag: { variant: 'Female' | 'Male' };
    Box: { variant: string };
    Case: { variant: 'Berry' | 'PokeBlock' | 'TM' | string };
    Custom: { variant: string }; // e.g. unown dex
    Menu: {
      variant:
        | 'EV-IV'
        | 'Moves'
        | 'Learner'
        | 'Party'
        | 'PC'
        | 'Shop'
        | 'Stats'
        | 'Style'
        | string;
    };
    Pokedex: { variant: string };
    PokeNav: { variant: string }; // Not supported in vanilla
    'Town Map': { variant: 'Cosmetic' | 'Mainland' | 'Sevii' | string };
  };

  // TODO: Do we want User-Defined categories, too?
  //Other: UserDefined;
};

// Acceptable values for the `variant` field
type SpriteVariantValue<V> =
  | V
  | V[]
  | {
      animated?: V[];
      animatedShiny?: V[];
      default?: V[];
      shiny?: V[];
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
  category:
    | SpriteUnionType
    | SpriteUnionType[]
    | { [key: string]: SpriteUnionType };
}

/*
 * Scripts
 */
declare type ScriptsCategory =
  | 'AdvanceMap'
  | 'C-Injection'
  | 'HexManiacAdvance'
  | 'HMA Script'
  | 'ModEXE'
  | 'Python'
  | string;

declare type ScriptsFeatures =
  | 'Ability'
  | 'Attack'
  | 'Engine'
  | 'Gift'
  | 'Map'
  | 'Miscellaneous'
  | 'NPC'
  | 'Shop'
  | 'Tutor'
  | string;

declare type ScriptPrerequisites =
  | '32MB'
  | 'CFRU'
  | 'CFRU-EX' // By Shiny-Miner
  | 'DPE'
  | 'HUBOL'
  | 'JPAN'
  | 'Leon'
  | 'Shinyzer'
  | string;

declare interface ScriptsData {
  targetedVersions: SupportedBaseRomVersion[]; // Only scripts care about v1.0 vs v1.1
  categories: ScriptsCategory[];
  features: ScriptsFeatures[];
  prerequisites?: ScriptPrerequisites[];
}

/*
 * SOUND
 */
declare type SoundCategory = 'Cry' | 'Jingle' | 'SFX' | 'Song';

declare interface SoundData extends AssetHive {
  category: SoundCategory;
}

// Placeholder data for all types, to show that an item was deleted.
declare interface DeletedEntry {
  _id: string;
  deleted: boolean;
  reason?: string; // Optional for now, but later server will provide a reason.
}

declare type ListEntry<T extends ListingData> = T | DeletedEntry;
