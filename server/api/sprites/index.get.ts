import Sprites from '~~/server/models/Listings/Sprites';

export default defineEventHandler(async (event) => {
  return await createListingEndpoint(event, Sprites, 'fetchAll', 'Sprite');
});
