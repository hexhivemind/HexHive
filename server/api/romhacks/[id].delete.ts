import Romhacks from '~/server/models/Listings/Romhacks';

export default defineEventHandler(async (event) => {
  return await createListingEndpoint(
    event,
    Romhacks,
    'deleteListing',
    'Romhack',
  );
});
