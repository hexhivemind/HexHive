import Sounds from '~/server/models/Listings/Sounds';

export default defineEventHandler(async (event) => {
  return await createListingEndpoint(event, Sounds, 'fetchOne', 'Sound');
});
