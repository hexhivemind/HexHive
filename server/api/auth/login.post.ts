import Users from '~/server/models/User';

export default defineEventHandler(async (event) => {
  const { identity, password } = await readBody(event);
  const user = await Users.findOne({
    $or: [{ email: identity }, { username: identity }],
  });
  if (!user || !(await verifyPassword(password, user.password))) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' });
  }

  await setUserSession(event, {
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      authMethod: 'password',
    },
    loggedInAt: Date.now(),
  });
});
