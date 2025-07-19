import Romhacks from '~~/server/models/Listings/Romhacks';

export default defineEventHandler(async (event) => {
  return await createListingEndpoint(event, Romhacks, 'fetchOne', 'Romhack');
});
