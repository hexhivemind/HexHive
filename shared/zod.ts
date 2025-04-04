import { z } from 'zod';
import {
  baseRom,
  baseRomRegion,
  baseRomVersion,
  emailOrUsername,
  SpriteEntrySchema,
} from './zod-helpers';
import { runtimeTypes } from '~/types/runtimeTypes.generated';

const email = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Must be a valid email' });

const username = z.string().optional();

const password = z.string().min(3, { message: 'Password is too short' });

const passwordSchema = z.object({
  identity: emailOrUsername,
  username,
  password,
});
const webauthnSchema = z.object({ email, username });

export const webauthnValidator = z.object({
  userName: email,
  displayName: username,
});

export function loginValidator(mode: 'password'): typeof passwordSchema;
export function loginValidator(mode: 'webauthn'): typeof webauthnSchema;

export function loginValidator(mode: 'password' | 'webauthn') {
  switch (mode) {
    case 'password':
      return passwordSchema;
    case 'webauthn':
      return webauthnSchema;
  }
}

// Possible thing for later: Use two different validators for one input.
/*
const identity = z
  .string()
  .min(1, { message: 'Email or username is required' })
  .superRefine((val, ctx) => {
    if (val.includes('@')) {
      const emailCheck = z.string().email();
      const result = emailCheck.safeParse(val);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid email format',
        });
      }
    } else {
      const usernameCheck = z.string().min(3, {
        message: 'Username must be at least 3 characters',
      });
      const result = usernameCheck.safeParse(val);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error.issues[0].message,
        });
      }
    }
  });
*/
/*
handleSubmit((values) => {
  const isEmail = values.identity.includes('@');
  const payload = isEmail
    ? { email: values.identity, password: values.password }
    : { username: values.identity, password: values.password };
});
*/

const ListingDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  author: z.string(),
  slug: z.string().optional(),
  rating: z.number().optional(),
});

const AssetHiveSchema = ListingDataSchema.extend({
  fileSize: z.number(),
  fileCount: z.number(),
  fileList: z.array(z.string()),
  targetedRoms: z.array(z.string()), // You could pull from a const array if desired
});

export const SpriteCategorySchema = z.union([
  SpriteEntrySchema,
  z.array(SpriteEntrySchema),
  z.record(z.string(), SpriteEntrySchema),
]);

export const RomhackDataSchema = ListingDataSchema.extend({
  filename: z.string(),
  baseRom,
  baseRomVersion,
  baseRomRegion,
  release: z.string(),
  lastUpdated: z.date().optional(),
  releaseDate: z.date().optional(),
  boxArt: z.array(z.string()).optional(),
  screenshots: z.array(z.string()).optional(),
  trailer: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  flags: z.array(z.string()).optional(),
  changelog: z
    .object({
      entries: z.map(z.string(), z.string()),
    })
    .optional(),
});

export const SpritesDataSchema = AssetHiveSchema.extend({
  category: SpriteCategorySchema,
});

export const ScriptsDataSchema = AssetHiveSchema.extend({
  targetVersions: z
    .array(baseRomVersion)
    .min(1, 'At least one version must be selected')
    .refine((arr) => new Set(arr).size === arr.length, {
      message: 'Each version can only be selected once',
    }),
});

export const SoundData = AssetHiveSchema.extend({
  category: z.enum(runtimeTypes.SoundCategory),
});

/*
ChatGPT to do later:
Narrow type/subtype to known values

Allow only certain variant formats for specific subtype combos

Or build .refine() logic (e.g. “if type is 'Battle', subtype must be one of...”)
*/
