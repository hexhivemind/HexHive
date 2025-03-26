import Romhacks from '~/server/models/Listings/Romhacks';

export default defineEventHandler(async () => {
  await connectMongoose();
  const romhacks = await Romhacks.find().lean<RomhackData[]>().exec();
  return romhacks;
});
