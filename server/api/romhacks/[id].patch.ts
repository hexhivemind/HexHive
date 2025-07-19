import Romhacks from '~~/server/models/Listings/Romhacks';
import { RomhackDataSchema } from '~~/shared/zod';

export default defineEventHandler(async (event) => {
  return await createListingEndpoint(
    event,
    Romhacks,
    'updateListing',
    'Romhack',
    RomhackDataSchema,
  );
});
