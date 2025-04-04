import type { SchemaDefinition } from 'mongoose';
import { runtimeTypes } from '~/types/runtimeTypes.generated';

export const BaseListings: SchemaDefinition<ListingData> = {
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  author: { type: String, required: true, index: true },
  slug: { type: String },
  rating: Number,
};

export const AssetHives: SchemaDefinition<AssetHive> = {
  ...BaseListings,

  fileSize: { type: Number, required: true },
  fileCount: { type: Number, required: true },
  fileList: { type: [String], default: [], required: true },
  targetedRoms: {
    type: [String],
    enum: runtimeTypes.SupportedBaseRom,
    required: true,
    index: true,
  },
};
