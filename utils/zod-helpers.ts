import { z } from 'zod';

export const emailOrUsername = z
  .string()
  .min(1, { message: 'Email or username is required' })
  .superRefine((val, ctx) => {
    if (val.includes('@')) {
      const result = z.string().email().safeParse(val);
      if (!result.success)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid email format',
        });
    } else {
      const result = z.string().min(3).safeParse(val);
      if (!result.success)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error.issues[0].message,
        });
    }
  });
