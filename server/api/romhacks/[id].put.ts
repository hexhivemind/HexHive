import Romhacks from '~/server/models/Listings/Romhacks';

export default defineEventHandler(async (event) => {
  await connectMongoose();
  const id = event.context.params?.id;
  const body = await readBody(event);

  const updated = await Romhacks.findByIdAndUpdate(id, body, { new: true })
    .lean<RomhackData>()
    .exec();
  return updated;
});
