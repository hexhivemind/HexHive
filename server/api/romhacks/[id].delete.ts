import Romhacks from '~/server/models/Listings/Romhacks';

export default defineEventHandler(async (event) => {
  await connectMongoose();
  const id = event.context.params?.id;
  await Romhacks.findByIdAndDelete(id).exec();
  return { success: true };
});
