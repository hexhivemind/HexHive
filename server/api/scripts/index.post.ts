import Scripts from '~~/server/models/Listings/Scripts';
import { ScriptDataSchema } from '~~/shared/zod';

export default defineEventHandler(async (event) => {
  return await createListingEndpoint(
    event,
    Scripts,
    'createListing',
    'Script',
    ScriptDataSchema,
  );
});
