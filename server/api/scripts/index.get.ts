import Scripts from '~~/server/models/Listings/Scripts';

export default defineEventHandler(async (event) => {
  return await createListingEndpoint(event, Scripts, 'fetchAll', 'Script');
});
