import type { SchemaDefinition } from 'mongoose';
import { runtimeTypes } from '~/types/runtimeTypes.generated';

export const BaseListings: SchemaDefinition<ListingData> = {
  author: { type: String, required: true, index: true },
  description: { type: String, required: true },
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
