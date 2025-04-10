import Sprites from '~/server/models/Listings/Sprites';
import { SpriteDataSchema } from '~/shared/zod';

export default defineEventHandler(async (event) => {
  return await createListingEndpoint(
    event,
    Sprites,
    'createListing',
    'Sprite',
    SpriteDataSchema,
  );
});
