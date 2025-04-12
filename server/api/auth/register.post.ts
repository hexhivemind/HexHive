import { ZodError } from 'zod';
import Users from '~/server/models/User';
import { passwordValidator } from '~/shared/zod';

export default defineEventHandler(async (event) => {
  try {
    const { identity, username, password } = passwordValidator.parse(
      await readBody(event),
    );

    const hashed = await hashPassword(password);
    const user = await Users.create({
      email: identity,
      username,
      password: hashed,
    });

    await setUserSession(event, {
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        authMethod: 'password',
      },
      loggedInAt: Date.now(),
    } as UserSession);

    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // Zod validation error
    if (err instanceof ZodError) {
      throw createError({
        statusCode: 400,
        message: err.message || 'Invalid input',
      });
    }

    // Duplicate email error
    if (err.code === 11000) {
      throw createError({
        statusCode: 400,
        message: 'Email already registered.',
      });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      throw createError({
        statusCode: 400,
        message: err.message,
      });
    }

    // Fallback error
    throw createError({
      statusCode: 500,
      message: 'Something went wrong.',
    });
  }
});
