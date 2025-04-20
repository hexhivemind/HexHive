import Users from '~/server/models/User';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // OPTIONAL: allow unathenticated access to specific routes
  // if (event.path.startsWith('/api/public')) return;

  const userId = session?.user?.id || null;
  if (!userId) return;

  await connectMongoose();

  const user = await Users.findById(userId);

  if (!user) {
    await clearUserSession(event);
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Session invalid or user no longer exists. Please log in again.',
    });
  }

  event.context.user = user; // Attach user to event context for later use
});
