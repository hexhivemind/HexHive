import type { ZodType } from 'zod';
import type { $ZodRawIssue } from '@zod/core';

export const email = z.email({ error: 'Must be a valid email' });

export const username = z
  .string()
  .min(3, 'Username is required')
  .regex(/^[^\s]+$/, { error: 'Username cannot contain spaces' })
  .regex(/^[^@]+$/, { error: "Username cannot contain '@'" })
  .regex(/^[a-zA-Z0-9._\-+]+$/, {
    error:
      'Username can only contain letters, numbers, underscores, dashes, dots, and pluses',
  });

export const password = z
  .string()
  .min(8, { error: 'Password is too short' })
  .regex(/[a-z]/, {
    error: 'Password must contain at least one lowercase letter',
  })
  .regex(/[A-Z]/, {
    error: 'Password must contain at least one uppercase letter',
  })
  .regex(/[0-9]/, { error: 'Password must contain at least one number' })
  .regex(/[^a-zA-Z0-9]/, {
    error: 'Password must contain at least one special character',
  });

export const emailOrUsername = z
  .string()
  .min(3, { error: 'Email or username is required' })
  .check(({ value, issues }) => {
    const schema = value.includes('@') ? email : username;
    const result = schema.safeParse(value);

    if (!result.success) {
      issues.push({
        code: 'custom',
        message: result.error.message,
        input: value,
      });
    }
  });

export const baseRom = z.enum(runtimeTypes.SupportedBaseRom);
export const baseRomVersion = z.enum(runtimeTypes.SupportedBaseRomVersion);
export const baseRomRegion = z.enum(runtimeTypes.SupportedBaseRomRegion);

function validateSpriteVariant(
  issues: $ZodRawIssue[],
  type: string,
  subtype: string,
  variant?: unknown,
): { shouldContinue: false } | { shouldContinue: true; variantDef: unknown } {
  const validTypes = Object.keys(runtimeTypes.SpriteVariant);

  if (!validTypes.includes(type)) {
    issues.push({
      code: 'custom',
      message: `Invalid sprite type: "${type}".`,
      input: type,
      path: ['type'],
    });
    return { shouldContinue: false };
  }

  const typeObj =
    runtimeTypes.SpriteVariant[type as keyof typeof runtimeTypes.SpriteVariant];
  const validSubtypes = Object.keys(typeObj);
  if (!validSubtypes.includes(subtype)) {
    issues.push({
      code: 'custom',
      message: `Invalid subtype "${subtype}" for type "${type}".`,
      input: subtype,
      path: ['subtype'],
    });
    return { shouldContinue: false };
  }

  const subtypeData = typeObj[subtype as keyof typeof typeObj] as {
    variant?: unknown;
  };
  const variantDef = subtypeData?.variant;

  // Case: variant should NOT be present
  if (variantDef === undefined) {
    if (variant) {
      issues.push({
        code: 'custom',
        message: `No variant expected for type "${type}" and subtype "${subtype}", but one was provided.`,
        input: variant,
        path: ['variant'],
      });
    }
    return { shouldContinue: false };
  }

  // Case: variant *must* be present
  if (
    variant === undefined ||
    (typeof variant === 'string' && variant.trim() === '') ||
    (Array.isArray(variant) && variant.length === 0)
  ) {
    issues.push({
      code: 'custom',
      message: `Variant is required for type "${type}" and subtype "${subtype}".`,
      input: variant,
      path: ['variant'],
    });
    return { shouldContinue: false };
  }

  // Case: free-form allowed (no value validation needed)
  if (variantDef === 'string') return { shouldContinue: false };

  // Case: Variant can only be one possible value
  if (typeof variantDef === 'string') {
    if (typeof variant !== 'string' || variant !== variantDef) {
      issues.push({
        code: 'custom',
        message: `Invalid variant value "${variant}" for type "${type}" and subtype "${subtype}".`,
        input: variant,
        path: ['variant'],
      });
    }
    return { shouldContinue: false };
  }

  return { shouldContinue: true, variantDef };
}

export const SpriteEntrySchema = z
  .object({
    type: z.string(),
    subtype: z.string(),
    variant: z
      .union([
        z.string(),
        z.array(z.string()),
        z.record(z.string(), z.union([z.string(), z.array(z.string())])),
      ])
      .optional(),
  })
  .check(({ value, issues }) => {
    const { type, subtype, variant } = value;
    const validator = validateSpriteVariant(issues, type, subtype, variant);

    if (!validator.shouldContinue) return;
    const { variantDef } = validator;

    // Case: strict enum list
    if (Array.isArray(variantDef)) {
      const validValues = variantDef;
      const validate = (val: string) => {
        if (!validValues.includes(val))
          issues.push({
            code: 'custom',
            message: `Invalid variant value "${val}" for type "${type}" and subtype "${subtype}".`,
            input: val,
            path: ['variant'],
          });
      };

      if (typeof variant === 'string') validate(variant);
      else if (Array.isArray(variant)) variant.forEach(validate);
      else if (typeof variant === 'object' && variant !== null)
        Object.values(variant).flat().forEach(validate);
    }
  }) as ZodType<SpriteUnionType>;

export const SpriteCategorySchema = z.union([
  SpriteEntrySchema,
  z.array(SpriteEntrySchema),
  z.record(z.string(), SpriteEntrySchema),
]) satisfies ZodType<SpritesData['category']>;

export const SpriteFileMapEntrySchema = z
  .object({
    type: z.string(),
    subtype: z.string(),
    variant: z
      .union([
        z.string().optional(),
        z.tuple([z.enum(runtimeTypes.spriteMapCategory), z.string()]),
      ])
      .optional(),
  })
  .check(({ value, issues }) => {
    const { type, subtype, variant } = value;
    const validator = validateSpriteVariant(issues, type, subtype, variant);

    if (!validator.shouldContinue) return;
    const { variantDef } = validator;

    if (Array.isArray(variantDef)) {
      const validValues = variantDef;
      const validate = (val: string) => {
        if (!validValues.includes(val))
          issues.push({
            code: 'custom',
            message: `Invalid variant value "${val}" for type "${type}" and subtype "${subtype}".`,
            input: val,
            path: ['variant'],
          });
      };

      if (typeof variant === 'string') validate(variant);
      else if (Array.isArray(variant)) {
        const [key, val] = variant;
        if (!runtimeTypes.spriteMapCategory.includes(key)) {
          issues.push({
            code: 'custom',
            message: `Invalid variant key "${key}" for type "${type}" and subtype "${subtype}" with variant ${val}.`,
            input: variant,
            path: ['variant'],
          });
          return;
        }
        validate(val);
      }
    }
  }) as ZodType<SpriteFileMapping>;

export const SpriteFileMapSchema = z
  .record(z.string(), SpriteFileMapEntrySchema)
  .optional() as ZodType<SpritesData['fileMap']>;
