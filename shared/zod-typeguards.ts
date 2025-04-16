import { SpriteDataSchema } from './zod';
import { SpriteCategorySchema } from './zod-helpers';

export const isValidCategory = (
  data: unknown,
): data is SpriteData['category'] =>
  SpriteCategorySchema.safeParse(data).success;

export const isValidSpriteData = (data: unknown): data is SpriteData =>
  SpriteDataSchema.safeParse(data).success;
