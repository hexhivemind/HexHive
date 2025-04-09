import Romhacks from '~/server/models/Listings/Romhacks';

export default defineEventHandler(async (event) => {
  await connectMongoose();

  const query = getQuery(event);
  const page = Math.max(parseInt(query.page as string) || 1, 1); // Ensure page is a positive integer
  const limit = Math.min(
    Math.max(parseInt(query.limit as string) || 0, 0),
    100, // Max limit of 100 items per page
  ); // Ensure limit is a positive integer, or 0 = no limit

  const findQuery = Romhacks.find().sort({ releaseDate: -1 });

  // If limit is greater than 0, apply pagination
  if (limit > 0) {
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    findQuery.skip(skip).limit(limit);
  }

  const [romhacks, totalItems] = await Promise.all([
    findQuery.lean<RomhackData[]>().exec(),
    Romhacks.countDocuments().exec(),
  ]);

  return {
    data: romhacks,
    pagination:
      limit > 0
        ? {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            hasNextPage: page * limit < totalItems,
            hasPrevPage: page > 1,
          }
        : null,
  };
});
