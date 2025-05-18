type UserPermissions = {
  canManageFlags: boolean;
  [permission: string]: boolean;
};

declare type UserRole = 'user' | 'moderator' | 'admin';

declare type Pronouns =
  | 'He/Him'
  | 'She/Her'
  | 'They/Them'
  | 'Prefer not to say' // Special case, don't display this in the UI
  | string;

declare type Socials =
  | 'Bluesky'
  | 'DeviantArt'
  | 'Discord Username' // Can we use overlapping ( () ) icons? // What do you mean by overlapping icons? What Icons?
  | 'Discord Server' // Same as above?
  | 'Github'
  | 'Ko-fi'
  | 'Linktr.ee'
  | 'Pokecommunity'
  | 'Reddit'
  | 'Revolt'
  | 'Twitch'
  | 'Twitter'
  | 'WhackAHack';

declare interface User {
  avatar?: string;
  email: string;
  displayName?: string;
  joinDate?: Date;
  lastActiveDate?: Date;
  permissions: UserPermissions;
  pronouns?: Pronouns;
  role: UserRole;
  socials: { [social in Socials]?: string } & { [other: string]: string };
  username: string;
}
