import mongoose, { Schema, model, type Model } from 'mongoose';

import { applyAutoIncrement, AssetHives } from './Shared';

const SpritesSchema = new Schema<SpriteData>({
  ...AssetHives,

  category: { type: Schema.Types.Mixed, required: true },
  fileMap: {
    type: Map,
    of: {
      type: { type: String, required: true },
      subtype: { type: String, required: true },
      variant: {
        type: Schema.Types.Mixed,
        required: false,
      },
    },
    required: false,
  },
});

applyAutoIncrement(SpritesSchema, 'Sprites');

const Sprites: Model<SpriteData> =
  mongoose.models.Sprites || model<SpriteData>('Sprites', SpritesSchema);

export default Sprites;
