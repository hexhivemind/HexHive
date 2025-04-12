import {
  baseRom,
  baseRomRegion,
  baseRomVersion,
  email,
  emailOrUsername,
  password,
  SpriteEntrySchema,
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
  id: z.number().optional(),
  author: z.string().optional(),
  _id: z.string().optional(),
});

const AssetHiveSchema = ListingDataSchema.extend({
  fileSize: z.number(),
  fileCount: z.number(),
  targetedRoms: z.array(z.string()), // You could pull from a const array if desired

  // Set by back-end, not user input
  fileList: z.array(
    z
      .object({
        filename: z.string(),
        originalFilename: z.string(),
      })
      .optional(),
  ),
});

export const SpriteCategorySchema = z.union([
  SpriteEntrySchema,
  z.array(SpriteEntrySchema),
  z.record(z.string(), SpriteEntrySchema),
]);

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
      entries: z.map(z.string(), z.string()),
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
  lastUpdated: z.date().optional(),
  releaseDate: z.date().optional(), // TODO: User Set original release date?
});

export const SpriteDataSchema = AssetHiveSchema.extend({
  category: SpriteCategorySchema,
});

export const ScriptDataSchema = AssetHiveSchema.extend({
  targetVersions: z
    .array(baseRomVersion)
    .min(1, 'At least one version must be selected')
    .refine((arr) => new Set(arr).size === arr.length, {
      error: 'Each version can only be selected once',
    }),
});

export const SoundDataSchema = AssetHiveSchema.extend({
  category: z.enum(runtimeTypes.SoundCategory),
});
