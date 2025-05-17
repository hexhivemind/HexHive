type Permissions = {
  canManageFlags: boolean;
  [permission: string]: boolean;
};

declare type Pronouns = 'He/Him' | 'She/Her' | 'They/Them' | string;

declare type Socials =
  | 'Bluesky'
  | 'DeviantArt'
  | 'Discord Username'
  | 'Discord Server'
  | 'Github'
  | 'Ko-fi'
  | 'Linktr.ee'
  | 'Pokecommunity'
  | 'Revolt'
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
