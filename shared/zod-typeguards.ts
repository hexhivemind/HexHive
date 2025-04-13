import { SpriteDataSchema } from './zod';
import { SpriteCategorySchema } from './zod-helpers';

export const isValidCategory = (
  data: unknown,
): data is
  | SpriteUnionType
  | SpriteUnionType[]
  | Record<string, SpriteUnionType> => {
  return SpriteCategorySchema.safeParse(data).success;
};

export const isValidSpritesData = (data: unknown): data is SpritesData =>
  SpriteDataSchema.safeParse(data).success;
