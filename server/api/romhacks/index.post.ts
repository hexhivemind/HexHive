import Romhacks from '~/server/models/Listings/Romhacks';
import { RomhackDataSchema } from '~/shared/zod';

export const config = {
  bodyParser: false,
};

export default defineEventHandler(async (event) => {
  return await createListingEndpoint(
    event,
    Romhacks,
    'createListing',
    'Romhack',
    RomhackDataSchema,
  );
});
