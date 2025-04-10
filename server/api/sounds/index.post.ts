import Sounds from '~/server/models/Listings/Sounds';
import { SoundDataSchema } from '~/shared/zod';

export default defineEventHandler(async (event) => {
  return await createListingEndpoint(
    event,
    Sounds,
    'createListing',
    'Sound',
    SoundDataSchema,
  );
});
