export const email = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Must be a valid email' });

export const username = z
  .string()
  .min(3, 'Username is required')
  .regex(/^[^\s]+$/, { message: 'Username cannot contain spaces' })
  .regex(/^[^@]+$/, { message: "Username cannot contain '@'" })
  .regex(/^[a-zA-Z0-9._\-+]+$/, {
    message:
      'Username can only contain letters, numbers, underscores, dashes, dots, and pluses',
  });

export const password = z
  .string()
  .min(8, { message: 'Password is too short' })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Password must contain at least one special character',
  });

export const emailOrUsername = z
  .string()
  .min(3, { message: 'Email or username is required' })
  .superRefine((val, ctx) => {
    const schema = val.includes('@') ? email : username;
    const result = schema.safeParse(val);

    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error.issues[0].message,
      });
    }
  });

export const baseRom = z.enum(runtimeTypes.SupportedBaseRom);
export const baseRomVersion = z.enum(runtimeTypes.SupportedBaseRomVersion);
export const baseRomRegion = z.enum(runtimeTypes.SupportedBaseRomRegion);

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
  .superRefine((data, ctx) => {
    const { type, subtype, variant } = data;

    const validTypes = Object.keys(runtimeTypes.SpriteVariant);
    if (!validTypes.includes(type)) {
      ctx.addIssue({
        path: ['type'],
        code: z.ZodIssueCode.custom,
        message: `Invalid sprite type: "${type}".`,
      });
      return;
    }

    const typeObj =
      runtimeTypes.SpriteVariant[
        type as keyof typeof runtimeTypes.SpriteVariant
      ];
    const validSubtypes = Object.keys(typeObj);
    if (!validSubtypes.includes(subtype)) {
      ctx.addIssue({
        path: ['subtype'],
        code: z.ZodIssueCode.custom,
        message: `Invalid subtype "${subtype}" for type "${type}".`,
      });
      return;
    }

    const subtypeData = typeObj[subtype as keyof typeof typeObj] as {
      variant?: unknown;
    };

    const variantDef = subtypeData?.variant;

    // Case: variant should NOT be present
    if (variantDef === undefined) {
      if (variant !== undefined)
        ctx.addIssue({
          path: ['variant'],
          code: z.ZodIssueCode.custom,
          message: `No variant expected for type "${type}" and subtype "${subtype}", but one was provided.`,
        });
      return;
    }

    // Case: variant *must* be present
    if (
      variant === undefined ||
      (typeof variant === 'string' && variant.trim() === '') ||
      (Array.isArray(variant) && variant.length === 0)
    ) {
      ctx.addIssue({
        path: ['variant'],
        code: z.ZodIssueCode.custom,
        message: `Variant is required for type "${type}" and subtype "${subtype}".`,
      });
      return;
    }

    // Case: free-form allowed (no value validation needed)
    if (variantDef === 'string') return;

    // Case: strict enum list
    if (Array.isArray(variantDef)) {
      const validValues = variantDef;

      const validate = (val: string) => {
        if (!validValues.includes(val))
          ctx.addIssue({
            path: ['variant'],
            code: z.ZodIssueCode.custom,
            message: `Invalid variant value "${val}" for type "${type}" and subtype "${subtype}".`,
          });
      };

      if (typeof variant === 'string') validate(variant);
      else if (Array.isArray(variant)) variant.forEach(validate);
      else if (typeof variant === 'object' && variant !== null)
        Object.values(variant).flat().forEach(validate);
    }
  });
