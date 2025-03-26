import type { SchemaDefinition } from 'mongoose';

export const BaseListings: SchemaDefinition = {
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  slug: String,
  rating: Number,
};
