import mongoose, { Schema, model, type Model } from 'mongoose';

import { applyAutoIncrement, BaseListings } from './Shared';
import { runtimeTypes } from '~/types/runtimeTypes.generated';

const RomhacksSchema = new Schema<RomhackData>({
  ...BaseListings,

  baseRom: {
    type: String,
    required: true,
    enum: runtimeTypes.SupportedBaseRom,
    index: true,
  },
  baseRomVersion: {
    type: String,
    required: true,
    enum: runtimeTypes.SupportedBaseRomVersion,
    index: true,
  },
  baseRomRegion: {
    type: String,
    required: true,
    enum: runtimeTypes.SupportedBaseRomRegion,
    index: true,
  },
  categories: {
    type: [String],
    required: true,
    index: true,
  },
  states: {
    type: [String],
    required: true,
    index: true,
  },
  release: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now() },

  releaseDate: Date,
  boxart: [String],
  screenshots: [String],
  trailer: [String],
  tags: [String],
  flags: [String],

  changelog: {
    entries: {
      type: Map,
      of: String,
      default: {},
    },
  },

  fileHash: { type: String, required: true, unique: true, index: true },
  filename: { type: String, required: true },
  originalFilename: { type: String, required: true },
});

RomhacksSchema.index(
  { slug: 1 },
  {
    unique: true,
    partialFilterExpression: { slug: { $exists: true, $type: 'string' } },
  },
);

applyAutoIncrement(RomhacksSchema, 'Romhack');

const Romhacks: Model<RomhackData> =
  mongoose.models.Romhacks || model<RomhackData>('Romhacks', RomhacksSchema);

export default Romhacks;
