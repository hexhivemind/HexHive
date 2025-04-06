declare type AssetPermission = 'Credit' | 'Free' | 'No-Donations' | 'No-Profit';

declare interface ListingData {
  // Required:
  author: string;
  description: string;
  id: string; // Optional? Auto-incrementing unique id used for route navigation if slug not set?
  permissions: AssetPermission[];
  title: string;

  // Optional:
  _id?: string; // Set by database, will be private, internal
  rating?: number;
  slug?: string; // User set id for route navigation, unique.
}

declare type SupportedBaseRom = 'Emerald' | 'Fire Red'; // | 'Ruby'
declare type SupportedBaseRomRegion =
  | 'English'
  | 'French'
  | 'German'
  | 'Italian'
  | 'Japanese'
  | 'Spanish';
declare type SupportedBaseRomVersion = 'v1.0' | 'v1.1'; // TODO: Alias "squirrels"

// Per NO-INTRO (removed debug, box), these are known revisions
// Realistically, almost none of these will be used, but oh well
// - Emerald
//  - France
//  - Germany
//  - Italy
//  - Japan
//  - Spain
//  - US/EUR

// - Fire Red / Leaf Green
//  - France
//  - Germany
//  - Italy
//  - Japan v1, v1.1
//  - Spain
//  - US/EUR v1, v1.1

// - Ruby/Sapphire
//  - France v1, v1.1
//  - Germany v1, v1.1
//  - Italy v1, v1.1
//  - Japan v1, v1.1
//  - Spain v1, v1.1
//  - US/EUR v1, v1.1

declare interface RomhackData extends ListingData {
  // Required:
  baseRom: SupportedBaseRom;
  baseRomRegion: SupportedBaseRomRegion;
  baseRomVersion: SupportedBaseRomVersion;
  filename: string;
  release: string; // User-defined version

  // Optional:
  boxart?: string[];
  changelog?: {
    entries: { [version: string]: string };
  };
  flags?: string[]; // Internal/Moderator applied, flags like mature content
  lastUpdated?: luxon.DateTime; // TODO: will come from db, won't be optional
  releaseDate?: luxon.DateTime;
  screenshots?: string[];
  tags?: string[]; // User-defined tag cloud
  trailer?: string[];
  // TODO: Features, completion status, binary/decomp, etc
}

// A "Hive" is like a collection/folder/repository, etc
declare interface AssetHive extends ListingData {
  // Required:
  fileCount: number;
  fileList: string[];
  fileSize: number;
  targetedRoms: SupportedBaseRom[];
}

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

type SpriteVariant = {
  Battle: {
    Attack: { variant: undefined };
    Background: {
      variant: EnvironmentVariant;
    };
    Other: UserDefined;
    Pokeball: { variant: string };
    Pokemon: { variant: 'Back' | 'Front' };
    Trainer: { variant: 'Back' | 'Front' }; // Back should include pokeball throwing animation
  };

  Environment: {
    // Interactable (such as HM Trees)
    Object: { variant: 'HM' | 'Item' };
    Other: UserDefined;

    // Vignette that shows before certain POIs:
    Preview: {
      variant: EnvironmentVariant;
    };

    // Map tiles (ground, buildings, trees, etc)
    Tiles: {
      variant: EnvironmentVariant;
    };
  };

  GameIntro: {
    Background: { variant: 'Cutscene' | 'Title Screen' | string };
    Particles: { variant: 'Cutscene' | 'Title Screen' | string };
    'Publisher Splash Screens': {
      variant: 'Copyright' | 'Gamefreak Logo' | string;
    };
    Sprite: { variant: 'Cutscene' | 'Title Screen' | string };
    Text: {
      variant:
        | 'Copyright Footer'
        | 'Pokemon Logo'
        | 'Press Start'
        | 'ROM Title'
        | string;
    };
  };

  Menu: {
    // Items always look the same in every use
    Item: { variant: undefined };

    // Do we track for Emote variants in Dialogue?
    Mugshots: { variant: 'Battle' | 'Dialogue' };

    Other: UserDefined;

    // Unsure where these are used, or if they're the same sprite
    // These should appear when starting a game (+ one for the rival)
    // These also appear when looking at your Trainer Card, or the Hall of Fame
    Player: { variant: 'New Game' | 'Trainer Card' };

    // Party/Box sprite
    // Is this variant even necessary?
    Pokemon: { variant: 'Animated' | 'Static' };
  };

  Overworld: {
    NPC: { variant: HumanMovement };
    Other: UserDefined;
    Player: { variant: HumanMovement };
    Pokemon: { variant: 'Follower' | 'Land' | 'Surfing' };
  };

  UI: {
    Bag: { variant: 'Female' | 'Male' };
    Box: { variant: string };
    Case: { variant: 'Berry' | 'PokeBlock' | 'TM' | string };
    Custom: { variant: string }; // e.g. unown dex
    Menu: {
      variant:
        | 'Attacks'
        | 'Certificate'
        | 'EV-IV'
        | 'Hall of Fame'
        | 'Learner'
        | 'Mail'
        | 'Party'
        | 'PC Box'
        | 'Shop'
        | 'Stats'
        | 'Style'
        | string;
    };
    Pokedex: { variant: string };
    PokeNav: { variant: string }; // Not supported in vanilla
    'Town Map': { variant: 'Borders' | 'Mainland' | 'Sevii' | string };
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

type UserDefined = {
  variant: string;
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

declare type ScriptCategory =
  | 'Data Scraping' // e.g. pull data for PokemonShowdown, Excel, etc
  | 'Engine Upgrade' // e.g. Improved Battle AI
  | 'Feature'
  | 'Rombase' // e.g. Leon's Rombase, a Johto starter pack, etc
  | string;

// Can this be dependent on ScriptCategory = ['Feature' | string] ?
declare type ScriptFeature =
  | 'Ability'
  | 'Attack'
  | 'Cutscene'
  | 'Engine'
  | 'Gift'
  | 'Map Event'
  | 'Miscellaneous'
  | 'NPC'
  | 'Shop'
  | 'Trainer'
  | 'Tutor'
  | string;

declare type ScriptPrerequisite =
  | '32MB'
  | 'CFRU'
  | 'CFRU-Expansion' // By Shiny-Miner
  | 'DPE'
  | 'HUBOL'
  | 'JPAN'
  | 'Leon'
  | 'Physical/Special Split (PSS)'
  | 'Shinyzer'
  | string;

declare type ScriptTool =
  | 'AdvanceMap'
  | 'C-Injection'
  | 'HexManiacAdvance'
  | 'HMA Script'
  | 'ModExe'
  | 'Python'
  | string;

declare interface ScriptsData {
  features: ScriptFeature[];
  prerequisites?: ScriptPrerequisite[];
  targetedVersions: SupportedBaseRomVersion[]; // Only scripts care about v1.0 vs v1.1
  tools: ScriptTool[];
}

/*
 * SOUND
 */
declare type SoundCategory = 'Attack' | 'Cry' | 'Jingle' | 'SFX' | 'Song';

declare interface SoundData extends AssetHive {
  category: SoundCategory;
}

// Placeholder data for all types, to show that an item was deleted.
declare interface DeletedEntry {
  // Required:
  deleted: boolean;
  _id: string;

  // Optional:
  reason?: string; // Optional for now, but later server will provide a reason.
}

declare type ListEntry<T extends ListingData> = T | DeletedEntry;
