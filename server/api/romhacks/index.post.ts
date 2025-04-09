import type { FilterQuery } from 'mongoose';
import Romhacks from '~/server/models/Listings/Romhacks';
import { RomhackDataSchema } from '~/shared/zod';

export default defineEventHandler(async (event) => {
  await connectMongoose();

  const body = RomhackDataSchema.omit({ id: true, _id: true }).parse(
    await readBody(event),
  );

  const existing = await Romhacks.findOne({
    $or: [{ title: body.title }, body.slug ? { slug: body.slug } : null].filter(
      Boolean,
    ) as FilterQuery<RomhackData>[],
  });

  if (existing) {
    if (existing.title === body.title) {
      throw createError({
        statusCode: 409,
        statusMessage: 'A romhack with this title already exists.',
      });
    }

    // Technically can't get here if body.slug isn't defined, but just in case
    // we change the query in the future
    if (body.slug && existing.slug === body.slug) {
      throw createError({
        statusCode: 409,
        statusMessage: 'A romhack with this slug already exists.',
      });
    }
  }

  // Check for duplicates based on slug, id, or _id
  const exists = await Romhacks.exists({
    $or: [
      body.slug ? { slug: body.slug } : null,
      body._id ? { _id: body._id } : null,
    ].filter(Boolean) as FilterQuery<RomhackData>[],
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
