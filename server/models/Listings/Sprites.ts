import mongoose, { Schema, model, type Model } from 'mongoose';

import { AssetHives } from './Shared';

const SpritesSchema = new Schema<SpritesData>({
  ...AssetHives,

  category: { type: Schema.Types.Mixed, required: true },
});

const Sprites: Model<SpritesData> =
  mongoose.models.Sprites || model<SpritesData>('Sprites', SpritesSchema);

export default Sprites;
