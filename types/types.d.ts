type Permissions = {
  canManageFlags: boolean;
  [permission: string]: boolean;
};

declare interface User {
  username: string;
  avatar: string;
  email: string;
  password: string;
  role: 'user' | 'moderator' | 'admin';
  permissions: Permissions;
}
