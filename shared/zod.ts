import type { ZodType } from 'zod';
import {
  baseRom,
  baseRomRegion,
  baseRomVersion,
  email,
  emailOrUsername,
  password,
  SpriteFileMapSchema,
  SpriteCategorySchema,
  username,
} from './zod-helpers';

/* -------Front-end-----------*/
export const passwordSchema = z.object({
  identity: emailOrUsername,
  password,
});
export const webauthnSchema = z.object({ identity: emailOrUsername });

/* --------Back-end-----------*/
// Used for signup.
export const webauthnValidator = z.object({
  userName: email,
  displayName: username,
});

export const passwordValidator = passwordSchema.extend({
  identity: email,
  username,
});

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
  description: z.string(),
  permissions: z.array(z.enum(runtimeTypes.AssetPermission)),
  title: z.string(),

  rating: z.number().optional(),
  slug: z
    .string()
    .regex(/^(?!\d+$).+$/, { error: 'Slug cannot be only numbers' })
    .optional(),

  // Added by back-end, not user input
  id: z.int().optional(),
  author: z.string().optional(),
  _id: z.string().optional(),
  downloads: z.int().optional(),
}) satisfies ZodType<ListingData>;

const AssetHiveSchema = ListingDataSchema.extend({
  fileSize: z.int(),
  fileCount: z.int(),
  targetedRoms: z.array(z.enum(runtimeTypes.SupportedBaseRom)), // You could pull from a const array if desired

  // Set by back-end, not user input
  files: z.array(
    z.object({
      filename: z.string(),
      originalFilename: z.string(),
      size: z.int(),
    }),
  ),
}) satisfies ZodType<AssetHive>;

export const RomhackDataSchema = ListingDataSchema.extend({
  baseRom,
  baseRomVersion,
  baseRomRegion,
  categories: z.array(z.string()),
  release: z.string(),
  states: z.array(z.string()),

  boxArt: z.array(z.string()).optional(),
  changelog: z
    .object({
      entries: z.record(z.string(), z.string()),
    })
    .optional(),
  screenshots: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  trailer: z.array(z.string()).optional(),

  // Internal/Moderator applied, flags like mature content
  flags: z.array(z.string()).optional(),

  // Added by back-end, not user input
  filename: z.string().optional(),
  originalFilename: z.string().optional(),
  fileHash: z.string().optional(),
  lastUpdated: z.custom<luxon.DateTime>().optional(), // TODO: Add validators for this
  releaseDate: z.custom<luxon.DateTime>().optional(), // TODO: User Set original release date?
}) satisfies ZodType<RomhackData>;

export const SpriteDataSchema = AssetHiveSchema.extend({
  category: SpriteCategorySchema,
  fileMap: SpriteFileMapSchema,
}) satisfies ZodType<SpritesData>;

export const ScriptDataSchema = AssetHiveSchema.extend({
  category: z
    .array(z.string())
    .min(1, 'At least one category must be selected'),
  features: z.array(z.string()).min(1, 'At least one feature must be selected'),
  prerequisites: z.array(z.string()).optional(),
  targetedVersions: z
    .array(z.enum(runtimeTypes.SupportedBaseRomVersion))
    .min(1, 'At least one version must be selected')
    .refine((arr) => new Set(arr).size === arr.length, {
      error: 'Each version can only be selected once',
    }),
  tools: z.array(z.string()).min(1, 'At least one tool must be selected'),
}) satisfies ZodType<ScriptsData>;

export const SoundDataSchema = AssetHiveSchema.extend({
  category: z.enum(runtimeTypes.SoundCategory),
}) satisfies ZodType<SoundData>;
