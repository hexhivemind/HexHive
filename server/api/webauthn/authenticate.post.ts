import Users, { type WebAuthnCredential } from '~/server/models/User';
import type { H3Event } from 'h3';
import type { VerifiedAuthenticationResponse } from '@simplewebauthn/server';

type SuccessData = {
  credential: WebAuthnCredential;
  authenticationInfo: Exclude<
    VerifiedAuthenticationResponse['authenticationInfo'],
    undefined
  >;
};

export default defineWebAuthnAuthenticateEventHandler<WebAuthnCredential>({
  async storeChallenge(_event: H3Event, challenge: string, attemptId: string) {
    // Using useStorage for WebAuthn challenges since we're not using serverless or shared instances.
    // If we ever scale up, consider switching to MongoDB for consistency and TTL-based expiration.
    await useStorage().setItem(`attempt:${attemptId}`, challenge);
  },

  async getChallenge(event: H3Event, attemptId: string) {
    const challenge = await useStorage().getItem(`attempt:${attemptId}`);

    // Make sure to always remove the attempt because they are single use only!
    await useStorage().removeItem(`attempt:${attemptId}`);

    if (!challenge)
      throw createError({ statusCode: 400, message: 'Challenge expired' });

    return challenge;
  },

  async allowCredentials(event: H3Event, userName: string) {
    const user = await Users.findOne({ email: userName });

    if (!user || !user.credentials?.length)
      throw createError({
        statusCode: 400,
        message: 'User not found or has no credentials',
      });

    return user.credentials;
  },

  async getCredential(event: H3Event, credentialId: string) {
    const user = await Users.findOne({ 'credentials.id': credentialId });

    if (!user)
      throw createError({ statusCode: 400, message: 'Credential not found' });

    const credential = user.credentials!.find((c) => c.id === credentialId);

    if (!credential)
      throw createError({
        statusCode: 400,
        message: 'Credential not found in user record',
      });

    return credential;
  },

  async onSuccess(
    event: H3Event,
    { credential, authenticationInfo }: SuccessData,
  ) {
    const user = await Users.findOne({ 'credentials.id': credential.id });

    if (!user)
      throw createError({ statusCode: 400, message: 'User not found' });

    const stored = user.credentials!.find((c) => c.id === credential.id);

    if (stored) stored.counter = authenticationInfo.newCounter;

    await user.save();

    await setUserSession(event, {
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        authMethod: 'webauthn',
      },
      loggedInAt: Date.now(),
    } as UserSession);
  },
});
