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

declare interface UserSession {
  user: {
    id: string;
    email?: string;
    username?: string;
    authMethod?: 'password' | 'webauthn' | 'oauth'; // What is 'magic-link' suggested by chatgpt?
  };
  loggedInAt: ReturnType<typeof Date.now>;
  [key: string]: unknown;
}

declare module 'nuxt-auth-utils/runtime/types' {
  export * from 'nuxt-auth-utils/dist/runtime/types';
}

// declare module 'nuxt-auth-utils/dist/runtime/types';
