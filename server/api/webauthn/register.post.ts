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
    const session = (await getUserSession(event)) as Awaited<
      ReturnType<typeof getUserSession>
    > &
      UserSession;
    if (session.user?.email && session.user.email !== body.userName)
      throw createError({
        statusCode: 400,
        message: 'Email not matching current session',
      });

    if (
      session.user?.username &&
      body.displayName &&
      session.user.username !== body.displayName
    )
      throw createError({
        statusCode: 400,
        message: 'Username not matching current session',
      });

    return webauthnValidator.parse(body);
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
