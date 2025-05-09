declare type AssetPermission = 'Credit' | 'Free' | 'No-Donations' | 'No-Profit';

declare interface ListingData {
  // Required:
  description: string;
  permissions: AssetPermission[];
  title: string;

  // Optional:
  rating?: number;
  slug?: string; // User set id for route navigation, unique.

  // Server/Database managed:
  _id?: string; // Set by database, will be private, internal
  id?: number; // Optional? Auto-incrementing unique id used for route navigation if slug not set?
  author?: string; // User ID of the author (Possibly multiple later for shared ownership)
  downloads?: number; // Number of downloads (for listing)
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

type RomhackState =
  | 'Abandoned'
  | 'Actively Updated'
  | 'Alpha'
  | 'Beta'
  | 'Buggy'
  | 'Concept'
  | 'Demo'
  | 'Finished'
  | 'Playable (Completable)'
  | 'Playable (WIP)'
  | 'Under Development'
  | string;

type RomhackCategory =
  | 'Balanced'
  | 'Battle Overhaul' // e.g. Crown
  | 'Bugfix'
  | 'Competitive'
  | 'Completeable Dex' // e.g. "386" hacks
  | 'Custom Types' // e.g. Sound Type, Wood Type, etc
  | 'Demake' // e.g. Light Platinum
  | 'Demo'
  | 'Difficulty'
  | 'Expanded Dex'
  | 'Fakemons'
  | 'Game Jam'
  | 'Gen 1 mechanics' // Old battle engine quirks
  | 'Gen 2 mechanics' // Old battle engine quirks
  | 'Gen 3 mechanics' // Vanilla battle mechanics
  | 'Gen 4 mechanics' // e.g. Physical/Special Split (PSS)
  | 'Gen 5 mechanics'
  | 'Gen 6 mechanics' // e.g. Mega Evolutions
  | 'Gen 7 mechanics' // e.g. Z-Moves
  | 'Gen 8 mechanics' // e.g. Dynamax/Gigantamax
  | 'Gen 9 mechanics' // e.g. Terastalization
  | 'Graphics'
  | 'Humor' // e.g. Celia's Stupid Romhack, Clover, etc
  | 'MAGM' // Anythroyd's Make a Great Map semi-annual competition
  | 'Moderniziation' // Ranges between CFRU and improvements for old hacks like FRO
  | 'Nuzlocke Mode' // Built-in Nuzlocke mechanics
  | 'Puzzle'
  | 'Region Conversion' // e.g. Liquid Crystal
  | 'QoL'
  | 'Story'
  | 'Type Changes' // e.g. Fairy Type
  | 'Typechart Changes' // e.g. Water is now weak to Poison
  | 'Unbalanced'
  | 'Unique Mechanics' // e.g. Emerald Rogue, The Pit, etc
  | 'Unofficial Continuation' // e.g. Hacks of Drayano titles, etc
  | 'Vanilla+'
  | string;

declare interface RomhackData extends ListingData {
  // Required:
  baseRom: SupportedBaseRom;
  baseRomRegion: SupportedBaseRomRegion;
  baseRomVersion: SupportedBaseRomVersion;
  categories: RomhackCategory[];
  release: string; // User-defined version
  states: RomhackState[];

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

  // Server assigned (Always present after upload, but not before)
  fileHash?: string;
  filename?: string; // Server name for file
  originalFilename?: string; // Original name of the file (for download)
}

// A "Hive" is like a collection/folder/repository, etc
declare interface AssetHive extends ListingData {
  // Required:
  fileCount: number;
  files: { filename: string; originalFilename: string; size: number }[];
  fileSize: number; // Collective file size?
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

declare type SpriteMapCategory =
  | 'animated'
  | 'animatedShiny'
  | 'default'
  | 'shiny';

// Acceptable values for the `variant` field
type SpriteVariantValue<V> =
  | V
  | V[]
  | {
      [key in SpriteMapCategory]?: V[];
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
      variant?: SpriteVariant[T][S]['variant'] extends undefined
        ? undefined
        : SpriteVariantValue<SpriteVariant[T][S]['variant']>;
    };
  }[keyof SpriteVariant[T]];
}[keyof SpriteVariant];

declare type SpriteFileMapping = {
  [T in keyof SpriteVariant]: {
    [S in keyof SpriteVariant[T]]: {
      type: T;
      subtype: S;
      // Variant or [key, variant] (e.g. ['shiny', 'front'] or ['animatedShiny', 'back'])
      variant?: SpriteVariant[T][S]['variant'] extends undefined
        ? undefined
        :
            | SpriteVariant[T][S]['variant']
            | [SpriteMapCategory, SpriteVariant[T][S]['variant']];
    };
  }[keyof SpriteVariant[T]];
}[keyof SpriteVariant];

// Final interface: spriteKind resolves correctly based on type + subtype
declare interface SpriteData extends AssetHive {
  category:
    | SpriteUnionType
    | SpriteUnionType[]
    | { [key: string]: SpriteUnionType };
  fileMap?: { [filename: string]: SpriteFileMapping }; // Instead of Record<string, ...> to declare what the key represents
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
  | 'DPE'
  | 'HUBOL'
  | 'JPAN'
  | 'Leon'
  | 'Physical/Special Split (PSS)'
  | 'SCADE' // UCDEP?
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

declare interface ScriptData extends AssetHive {
  category: ScriptCategory[];
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
