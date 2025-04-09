import { isValidObjectId, type FilterQuery } from 'mongoose';
import Romhacks from '~/server/models/Listings/Romhacks';

export default defineEventHandler(async (event) => {
  await connectMongoose();
  const id = event.context.params?.id;

  // TODO: Archival soft deletion
  await Romhacks.findOneAndDelete({
    $or: [
      { slug: id },
      !isNaN(Number(id)) ? { id: Number(id) } : null,
      isValidObjectId(id) ? { _id: id } : null,
    ].filter(Boolean) as FilterQuery<RomhackData>[],
  }).exec();

  return { success: true };
});
