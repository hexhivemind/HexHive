import Users from '~/server/models/User';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  const hashed = await hashPassword(password);

  Users.insertOne({ email, password: hashed });

  try {
    await Users.create({ email, password: hashed });
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
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
