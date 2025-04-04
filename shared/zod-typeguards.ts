import { SpriteCategorySchema, SpritesDataSchema } from './zod';

export const isValidCategory = (
  data: unknown,
): data is
  | SpriteUnionType
  | SpriteUnionType[]
  | Record<string, SpriteUnionType> => {
  return SpriteCategorySchema.safeParse(data).success;
};

export const isValidSpritesData = (data: unknown): data is SpritesData =>
  SpritesDataSchema.safeParse(data).success;
