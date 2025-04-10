import { type FilterQuery, isValidObjectId, type Model } from 'mongoose';
import type { H3Event } from 'h3';
import type { ZodObject, ZodRawShape } from 'zod';

export type ListingEndpoint =
  | 'fetchAll'
  | 'fetchOne'
  | 'createListing'
  | 'updateListing'
  | 'deleteListing';

export type EndpointType = 'Romhack' | 'Sprite' | 'Sound' | 'Script' | 'Asset';

const idVariantsQuery = <T extends ListingData>(id: unknown) =>
  [
    { slug: id },
    !isNaN(Number(id)) ? { id: Number(id) } : null,
    isValidObjectId(id) ? { _id: id } : null,
  ].filter(Boolean) as FilterQuery<T>[];

export async function createListingEndpoint<
  T extends ListingData,
  S extends ZodObject<ZodRawShape>,
>(
  event: H3Event,
  model: Model<T>,
  route: ListingEndpoint,
  type: EndpointType,
  schema?: S,
) {
  switch (route) {
    case 'fetchAll':
      return await fetchAll(event, model, type, schema);
    case 'fetchOne':
      return await fetchOne(event, model, type, schema);
    case 'createListing':
      return await createListing(event, model, type, schema);
    case 'updateListing':
      return await updateListing(event, model, type, schema);
    case 'deleteListing':
      return await deleteListing(event, model, type, schema);
    default:
      throw createError({
        statusCode: 404,
        message: 'Route not found',
      });
  }
}

async function fetchAll<
  T extends ListingData,
  S extends ZodObject<ZodRawShape>,
>(event: H3Event, model: Model<T>, _type: EndpointType, _schema?: S) {
  await connectMongoose();

  const query = getQuery(event);
  const search = (query.search as string)?.trim() || null;
  const page = Math.max(parseInt(query.page as string) || 1, 1); // Ensure page is a positive integer
  const limit = Math.min(
    Math.max(parseInt(query.limit as string) || 0, 0),
    100, // Max limit of 100 items per page
  ); // Ensure limit is a positive integer, or 0 = no limit

  const searchConditions: FilterQuery<T>[] = [];

  if (search) {
    const dataSchema = model.schema;

    const directIndexes = Object.entries(dataSchema.paths)
      .filter(([_, path]) => path.options?.index === true)
      .map(([field]) => field);

    const compoundIndexes = dataSchema
      .indexes()
      .map(([fields]) => Object.keys(fields))
      .flat();

    const indexableFields = Array.from(
      new Set([...directIndexes, ...compoundIndexes]),
    );

    if (indexableFields.length > 0) {
      for (const field of indexableFields)
        searchConditions.push({
          [field]: { $regex: search, $options: 'i' },
        } as FilterQuery<T>);
    }
  }

  const searchQuery = searchConditions.length ? { $or: searchConditions } : {};

  const findQuery = model.find(searchQuery).sort({ releaseDate: -1 });

  // If limit is greater than 0, apply pagination
  if (limit > 0) {
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    findQuery.skip(skip).limit(limit);
  }

  const [data, totalItems] = await Promise.all([
    findQuery.lean<T[]>().exec(),
    // If searching, only count matched results
    model.countDocuments(searchQuery).exec(),
  ]);

  return {
    data,
    pagination:
      limit > 0
        ? {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            hasNextPage: page * limit < totalItems,
            hasPrevPage: page > 1,
          }
        : null,
  };
}

async function fetchOne<
  T extends ListingData,
  S extends ZodObject<ZodRawShape>,
>(event: H3Event, model: Model<T>, type: EndpointType, _schema?: S) {
  await connectMongoose();
  const id = event.context.params?.id;

  const data = await model
    .findOne({
      $or: idVariantsQuery<T>(id),
    })
    .lean<T>()
    .exec();

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: `${type} not found`,
    });
  }
  return data;
}

async function createListing<
  T extends ListingData,
  S extends ZodObject<ZodRawShape>,
>(event: H3Event, model: Model<T>, type: EndpointType, schema?: S) {
  if (!schema) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'Validation is required to create listings, but was not provided.',
    });
  }

  await connectMongoose();

  const body = schema
    .omit({ id: true, _id: true })
    .parse(await readBody(event));

  const existing = await model.findOne({
    $or: [{ title: body.title }, body.slug ? { slug: body.slug } : null].filter(
      Boolean,
    ) as FilterQuery<T>[],
  });

  if (existing) {
    if (existing.title === body.title) {
      throw createError({
        statusCode: 409,
        statusMessage: `A ${type} with this title already exists.`,
      });
    }

    // Technically can't get here if body.slug isn't defined, but just in case
    // we change the query in the future
    if (body.slug && existing.slug === body.slug) {
      throw createError({
        statusCode: 409,
        statusMessage: `A ${type} with this slug already exists.`,
      });
    }
  }

  // Check for duplicates based on slug, id, or _id
  const exists = await model.exists({
    $or: [
      body.slug ? { slug: body.slug } : null,
      !isNaN(Number(body.id)) ? { id: Number(body.id) } : null,
      isValidObjectId(body._id) ? { _id: body._id } : null, // _id shouldn't exist on creation, but check anyway.
    ].filter(Boolean) as FilterQuery<T>[],
  });

  if (exists) {
    throw createError({
      statusCode: 409,
      statusMessage: `This ${type} already exists.`,
    });
  }

  // Insert new listing
  const newDoc = (await model.create(body)).toObject();
  await broadcastSSE(`${type.toLowerCase()}:added`, newDoc);
  return newDoc;
}

async function updateListing<
  T extends ListingData,
  S extends ZodObject<ZodRawShape>,
>(event: H3Event, model: Model<T>, type: EndpointType, schema?: S) {
  if (!schema) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'Validation is required to update listings, but was not provided.',
    });
  }

  await connectMongoose();
  const id = event.context.params?.id;
  const body = schema.partial().parse(await readBody(event));

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

  const updated = await model
    .findOneAndUpdate(
      {
        $or: idVariantsQuery<T>(id),
      },
      body,
      { new: true },
    )
    .lean<T>()
    .exec();

  if (!updated)
    throw createError({
      statusCode: 404,
      statusMessage: `${type} not found`,
    });

  return updated;
}

async function deleteListing<
  T extends ListingData,
  S extends ZodObject<ZodRawShape>,
>(event: H3Event, model: Model<T>, _type: EndpointType, _schema?: S) {
  await connectMongoose();
  const id = event.context.params?.id;

  await model
    .findOneAndDelete({
      $or: idVariantsQuery<T>(id),
    })
    .exec();

  return { success: true };
}
