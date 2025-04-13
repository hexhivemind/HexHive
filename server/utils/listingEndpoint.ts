import { type FilterQuery, isValidObjectId, type Model } from 'mongoose';
import type { H3Event } from 'h3';
import type { ZodObject, ZodRawShape } from 'zod';
import formidable, { type Fields, type Files } from 'formidable';
import path from 'path';
import { stat, mkdir, readFile, copyFile } from 'fs/promises';
import crypto from 'crypto';

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
      statusMessage: `Validation is required to create ${type}s, but was not provided.`,
    });
  }

  await connectMongoose();

  // Parse multipart form
  const form = formidable({ multiples: true });

  const { fields, files } = await new Promise<{
    fields: Fields;
    files: Files;
  }>((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  let metadata: ListingData;

  try {
    metadata = JSON.parse(fields.metadata?.[0] || '{}');
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid metadata format',
    });
  }

  const fileArray = files.file ?? [];

  if (!fileArray.length)
    throw createError({
      statusCode: 400,
      statusMessage: `No file(s) uploaded for this ${type} listing.`,
    });

  const uploadBase = path.join(
    process.env.UPLOAD_PATH || '/public/uploads',
    type.toLowerCase(),
  );

  // Will be used for a folder name if multiple files, else file name.
  const folderName = `${metadata.slug || 'upload'}-${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
  const saveDir =
    fileArray.length > 1 ? path.join(uploadBase, folderName) : uploadBase;

  await mkdir(saveDir, { recursive: true });

  const savedFiles: {
    filename: string;
    originalFilename: string;
    size: number;
  }[] = [];

  for (const file of fileArray) {
    const ext = path.extname(file.originalFilename || '');
    const uniqueName =
      fileArray.length > 1
        ? `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
        : `${folderName}${ext}`;

    const destination = path.join(saveDir, uniqueName);

    await copyFile(file.filepath, destination);
    await stat(destination); // Ensure the file was copied successfully

    savedFiles.push({
      filename: uniqueName,
      originalFilename: file.originalFilename || uniqueName,
      size: file.size || 0,
    });
  }

  // Content-only specific metadata:
  if (type === 'Sprite') {
    const sprite = metadata as SpritesData & {
      spriteAssignments?: SpritesData['fileMap'];
    };
    const assignments = sprite.spriteAssignments;
    const fileMap: { [filename: string]: SpriteFileMapping } = {};

    for (const file of savedFiles) {
      const original = file.originalFilename;
      if (!original || !assignments?.[original]) continue; // Mapping is optional, or partial mappings, or choose to do mapping later or not at all.
      fileMap[file.filename] = assignments[original];
    }

    sprite.fileMap = fileMap;
    delete sprite.spriteAssignments; // Remove the original mapping, if it exists.
  }

  // Content Specific Metadata:
  switch (type) {
    case 'Romhack': {
      const [f] = savedFiles; // Romhack will only have one entry anyway.
      const fileBuffer = await readFile(path.join(saveDir, f.filename));
      const fileHash = crypto
        .createHash('sha256')
        .update(fileBuffer)
        .digest('hex');

      const romhack = metadata as RomhackData;

      romhack.filename = f.filename;
      romhack.originalFilename = f.originalFilename;
      romhack.fileHash = fileHash;
      break;
    }

    default: {
      const asset = metadata as AssetHive;
      asset.fileCount = fileArray.length;
      asset.files = savedFiles;
      asset.fileSize = savedFiles.reduce((acc, file) => acc + file.size, 0);
    }
  }

  const body = schema.omit({ id: true, _id: true }).parse(metadata) as T;

  const existing = (await model.findOne({
    $or: [
      type === 'Romhack'
        ? { fileHash: (body as unknown as RomhackData).fileHash }
        : null,
      { title: body.title },

      body.slug ? { slug: body.slug } : null,
      !isNaN(Number(body.id)) ? { id: Number(body.id) } : null,
      isValidObjectId(body._id) ? { _id: body._id } : null, // _id shouldn't exist on creation, but check anyway.
    ].filter(Boolean) as FilterQuery<T>[],
  })) as T | undefined;

  if (existing) {
    if (
      (type === 'Romhack' &&
        (existing as unknown as RomhackData).fileHash ===
          (body as unknown as RomhackData).fileHash) ||
      existing.id === body.id ||
      existing._id?.toString() === body._id
    ) {
      throw createError({
        statusCode: 409,
        statusMessage: `This ${type} already exists.`,
      });
    }

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
