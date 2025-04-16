import { SpriteDataSchema } from './zod';
import { SpriteCategorySchema } from './zod-helpers';

export const isValidCategory = (
  data: unknown,
): data is SpritesData['category'] =>
  SpriteCategorySchema.safeParse(data).success;

export const isValidSpritesData = (data: unknown): data is SpritesData =>
  SpriteDataSchema.safeParse(data).success;
