import type { FilterQuery } from 'mongoose';
import Romhacks from '~/server/models/Listings/Romhacks';

export default defineEventHandler(async (event) => {
  await connectMongoose();
  const body = await readBody(event);

  // Check for duplicates based on slug, id, or _id
  const exists = await Romhacks.exists({
    $or: [
      body.slug ? { slug: body.slug } : null,
      body._id ? { _id: body._id } : null,
    ].filter(Boolean) as FilterQuery<unknown>[],
  });

  if (exists) {
    throw createError({
      statusCode: 409,
      statusMessage: 'This romhack already exists.',
    });
  }

  // Insert new Romhack
  const newHack = (await Romhacks.create(body)).toObject();
  await broadcastSSE('romhack:added', newHack);
  return newHack;
});
