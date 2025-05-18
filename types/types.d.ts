type Permissions = {
  canManageFlags: boolean;
  [permission: string]: boolean;
};

declare type Pronouns = 'He/Him' | 'She/Her' | 'They/Them' | string;

declare type Socials =
  | 'Bluesky'
  | 'DeviantArt'
  | 'Discord Username' // Can we use overlapping ( () ) icons?
  | 'Discord Server' // Same as above?
  | 'Github'
  | 'Ko-fi'
  | 'Linktr.ee'
  | 'Pokecommunity'
  | 'Revolt'
  | 'Twitch'
  | 'Twitter'
  | 'WhackAHack';

declare interface User {
  avatar: string;
  email: string;
  displayName?: string;
  joinDate?: Date;
  lastActiveDate?: Date;
  permissions: Permissions;
  pronouns?: Pronouns;
  role: 'user' | 'moderator' | 'admin';
  socials: { [social in Socials]?: string } & { [other: string]: string };
  username: string;
}
