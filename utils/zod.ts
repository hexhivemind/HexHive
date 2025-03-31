import { z } from 'zod';

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
