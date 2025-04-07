import mongoose, {
  type InferSchemaType,
  type Model,
  type SchemaDefinition,
  Schema,
  model,
} from 'mongoose';

import { runtimeTypes } from '~/types/runtimeTypes.generated';

const CounterSchema = new Schema({
  _id: String,
  seq: { type: Number, default: 0 },
});

export const BaseListings: SchemaDefinition<ListingData> = {
  author: { type: String, required: true, index: true },
  description: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
  permissions: {
    type: [String],

    enum: runtimeTypes.AssetPermission,
    required: true,
    index: true,
  },
  rating: Number,
  slug: { type: String },
  title: { type: String, required: true, unique: true },
};

export const AssetHives: SchemaDefinition<AssetHive> = {
  ...BaseListings,

  fileCount: { type: Number, required: true },
  fileList: { type: [String], default: [], required: true },
  fileSize: { type: Number, required: true },
  targetedRoms: {
    type: [String],

    enum: runtimeTypes.SupportedBaseRom,
    index: true,
    required: true,
  },
};

export const Counter: Model<InferSchemaType<typeof CounterSchema>> =
  mongoose.models.Counter || model('Counter', CounterSchema);

export function applyAutoIncrement(schema: Schema, type: string) {
  schema.pre('save', async function (next) {
    if (this.isNew && this.id == null) {
      const counter = await Counter.findOneAndUpdate(
        {
          _id: type,
        },
        { $inc: { seq: 1 } },
        { upsert: true, new: true },
      );
      this.id = counter.seq;
    }
    next();
  });
}
