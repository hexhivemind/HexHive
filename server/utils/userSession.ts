import type { UserSession } from '#auth-utils';
import type { H3Event } from 'h3';

export async function getTypedUserSession(
  event: H3Event,
): Promise<typeof session & UserSession> {
  const session = await getUserSession(event);
  return session as typeof session & UserSession;
}
