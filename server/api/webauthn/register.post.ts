import Users, {
  type WebAuthnCredential,
  type WebAuthnUser,
} from '~/server/models/User';
import type { H3Event } from 'h3';
import { webauthnValidator } from '~/shared/zod';

export default defineWebAuthnRegisterEventHandler<WebAuthnUser>({
  // optional
  async validateUser(body: WebAuthnUser, event: H3Event) {
    await connectMongoose();

    // Step 1: Validate payload
    const parsed = webauthnValidator.parse(body);

    const isDev = process.env.NODE_ENV !== 'production';
    const session = (await getUserSession(event)) as Awaited<
      ReturnType<typeof getUserSession>
    > &
      UserSession;

    // Step 2: Validate session user still exists
    if (session?.user?.id) {
      const validSessionUser = await Users.findById(session.user.id);

      if (!validSessionUser) {
        console.warn(
          '[auth] Session user no longer exists in DB — clearing session',
        );
        await clearUserSession(event);
        throw createError({
          statusCode: 401,
          message: 'Session is invalid. Please log in again.',
        });
      }
    }

    // Step 3: Use validated input for DB check
    const existingUser = await Users.findOne({
      $or: [{ email: parsed.userName }, { username: parsed.displayName }],
    });

    if (existingUser && !session.user && !isDev) {
      throw createError({
        statusCode: 403,
        message:
          'User already exists. Please log in first to register new credentials.',
      });
    }

    if (
      existingUser &&
      session.user &&
      (existingUser.email !== session.user.email ||
        existingUser.username !== session.user.username)
    ) {
      throw createError({
        statusCode: 403,
        message: 'You are not authorized to modify this account.',
      });
    }

    return parsed;
  },

  async onSuccess(
    event: H3Event,
    {
      credential,
      user,
    }: { credential: WebAuthnCredential; user: WebAuthnUser },
  ) {
    await connectMongoose();

    try {
      const userData = {
        email: user.userName,
        username: user.displayName,
        credentials: [],
      };

      const dbUser = await Users.findOneAndUpdate(
        {
          $or: [{ email: userData.email }, { username: userData.username }],
        },
        { $setOnInsert: userData },
        { upsert: true, new: true },
      );

      dbUser.credentials!.push({
        transports: [],
        ...credential,
      });

      await dbUser.save();

      await setUserSession(event, {
        user: {
          id: dbUser._id.toString(),
          email: dbUser.email,
          username: dbUser.username,
          authMethod: 'webauthn',
        },
        loggedInAt: Date.now(),
      } as UserSession);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw createError({
        statusCode: 500,
        message: err.message.includes('duplicate key')
          ? 'User already registered'
          : 'Failed to store credential',
      });
    }
  },
});
