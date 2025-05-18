import type { AuthenticatorTransportFuture } from '@simplewebauthn/server';
import type { Model } from 'mongoose';
import mongoose, { Schema, model } from 'mongoose';

export interface WebAuthnCredential {
  id: string;
  publicKey: string;
  counter: number;
  backedUp: boolean;
  transports?: AuthenticatorTransportFuture[];
  [key: string]: unknown;
}

export interface WebAuthnUser {
  /**
   * For simplicity, this will be email.
   */
  userName: string;
  /**
   * For simplicity, this will be username.
   */
  displayName?: string;
  [key: string]: unknown;
}

// For adding extra data to the database that we don't need to know about on the front-end.
export type UserDocument = User & {
  oauth?: Record<string, unknown>; // TODO: Type this better once implemented.
  credentials?: WebAuthnCredential[];
  password: string;
};

const UserSchema = new Schema<UserDocument>({
  avatar: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    index: true,
  },
  displayName: { type: String, trim: true, index: true },
  joinDate: { type: Date, default: () => new Date() },
  lastActiveDate: { type: Date, default: () => new Date() },
  permissions: {
    canManageFlags: { type: Boolean, default: false },
    // Add more permissions here as needed
    // e.g., canDeleteFiles, canManageUsers, etc.
  },
  pronouns: String,
  role: {
    type: String,
    enum: runtimeTypes.UserRole,
    default: 'user',
    index: true,
  },
  socials: {
    type: Map,
    of: String,
    default: {},
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    index: true,
  },

  password: {
    type: String,
  },

  // For implementing oauth stuff.
  oauth: {},
  // WebAuthn/Passkeys
  credentials: [
    {
      id: { type: String, required: true, unique: false },
      publicKey: { type: String, required: true },
      counter: { type: Number, required: true },
      backedUp: { type: Boolean, required: true },
      transports: [{ type: String }],
    },
  ],
});

const User: Model<UserDocument> =
  mongoose.models.User || model('User', UserSchema);

export default User;
