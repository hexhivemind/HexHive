import { type FilterQuery, isValidObjectId } from 'mongoose';
import Romhacks from '~/server/models/Listings/Romhacks';

export default defineEventHandler(async (event) => {
  await connectMongoose();
  const id = event.context.params?.id;

  const romhack = await Romhacks.findOne({
    $or: [
      { slug: id },
      !isNaN(Number(id)) ? { id: Number(id) } : null,
      isValidObjectId(id) ? { _id: id } : null,
    ].filter(Boolean) as FilterQuery<RomhackData>[],
  })
    .lean<RomhackData>()
    .exec();

  if (!romhack) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Romhack not found',
    });
  }
  return romhack;
});
