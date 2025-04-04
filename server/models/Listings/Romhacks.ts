import mongoose, { Schema, model, type Model } from 'mongoose';

import { BaseListings } from './Shared';
import { runtimeTypes } from '~/types/runtimeTypes.generated';

const RomhacksSchema = new Schema<RomhackData>({
  ...BaseListings,

  filename: { type: String, required: true },
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
});

RomhacksSchema.index(
  { slug: 1 },
  {
    unique: true,
    partialFilterExpression: { slug: { $exists: true, $type: 'string' } },
  },
);

const Romhacks: Model<RomhackData> =
  mongoose.models.Romhacks || model<RomhackData>('Romhacks', RomhacksSchema);

export default Romhacks;
