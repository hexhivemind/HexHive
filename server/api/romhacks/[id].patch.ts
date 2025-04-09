import { type FilterQuery, isValidObjectId } from 'mongoose';
import Romhacks from '~/server/models/Listings/Romhacks';
import { RomhackDataSchema } from '~/shared/zod';

export default defineEventHandler(async (event) => {
  await connectMongoose();
  const id = event.context.params?.id;
  const body = RomhackDataSchema.partial().parse(await readBody(event));

  // let conflict: RomhackData | null = null;

  // if (body.title || body.slug) {
  //   conflict = await Romhacks.findOne({
  //     $or: [
  //       body.title ? { title: body.title } : null,
  //       body.slug ? { slug: body.slug } : null,
  //     ].filter(Boolean) as FilterQuery<RomhackData>[],
  //     _id: { $ne: body._id}
  //   });
  // }

  // if (conflict) {
  //   if (body.title && conflict.title === body.title) {
  //     throw createError({
  //       statusCode: 409,
  //       statusMessage: 'Another romhack with this title already exists.',
  //     });
  //   }

  //   if (body.slug && conflict.slug === body.slug) {
  //     throw createError({
  //       statusCode: 409,
  //       statusMessage: 'Another romhack with this slug already exists.',
  //     });
  //   }
  // }

  const updated = await Romhacks.findOneAndUpdate(
    {
      $or: [
        { slug: id },
        !isNaN(Number(id)) ? { id: Number(id) } : null,
        isValidObjectId(id) ? { _id: id } : null,
      ].filter(Boolean) as FilterQuery<RomhackData>[],
    },
    body,
    { new: true },
  )
    .lean<RomhackData>()
    .exec();

  if (!updated)
    throw createError({
      statusCode: 404,
      statusMessage: 'Romhack not found',
    });

  return updated;
});
