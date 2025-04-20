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
    const session = await getUserSession(event);

    // Step 2: Use validated input for DB check
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

      // Check for credential collision with another user
      const credentialInUse = await Users.findOne({
        'credentials.id': credential.id,
        _id: { $ne: dbUser._id },
      });

      if (credentialInUse) {
        throw createError({
          statusCode: 409,
          message:
            'There was a problem registering this device. Please try again.',
          data: { retry: true },
        });
      }

      const alreadyHasCredential = dbUser.credentials!.some(
        (c) => c.id === credential.id,
      );

      if (!alreadyHasCredential) {
        dbUser.credentials!.push({
          transports: [],
          ...credential,
        });
      }

      await dbUser.save();

      await setUserSession(event, {
        user: {
          id: dbUser._id.toString(),
          email: dbUser.email,
          username: dbUser.username,
          authMethod: 'webauthn',
        },
        loggedInAt: Date.now(),
      });
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
