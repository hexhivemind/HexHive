import Romhacks from '~/server/models/Listings/Romhacks';

export default defineEventHandler(async (event) => {
  await connectMongoose();
  const body = await readBody(event);
  const newHack = await Romhacks.create(body);
  return newHack;
});
