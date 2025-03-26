import mongoose, { Schema, model } from 'mongoose';

import { BaseListings } from './Shared';

const RomhacksSchema = new Schema<RomhackData>({
  ...BaseListings,

  filename: { type: String, required: true },
  baseRom: { type: String, required: true, enum: [], index: true },
  baseRomVersion: { type: String, required: true, enum: [], index: true },
  baseRomRegion: { type: String, required: true, enum: [], index: true },
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

export default mongoose.models.Romhacks ||
  model<RomhackData>('Romhacks', RomhacksSchema);
