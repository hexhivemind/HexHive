import 'h3';
import type Users, { UserDocument } from '~~/server/models/User';

declare module 'h3' {
  interface H3EventContext {
    // user?: UserDocument;
    user?: Awaited<ReturnType<typeof Users.findById<UserDocument>>>;
  }
}
