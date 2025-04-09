import Romhacks from '~/server/models/Listings/Romhacks';

export default defineEventHandler(async () => {
  await connectMongoose();
  const romhacks = await Romhacks.find()
    .sort({ releaseDate: -1 })
    .lean<RomhackData[]>()
    .exec();
  return romhacks;
});
