import mongoose, { Schema, model, type Model } from 'mongoose';

import { applyAutoIncrement, AssetHives } from './Shared';
import { runtimeTypes } from '~/types/runtimeTypes.generated';

const SoundsSchema = new Schema<SoundData>({
  ...AssetHives,

  category: {
    type: String,
    enum: runtimeTypes.SoundCategory,
    required: true,
    index: true,
  },
});

applyAutoIncrement(SoundsSchema, 'Sounds');

const Sounds: Model<SoundData> =
  mongoose.models.Sounds || model<SoundData>('Sounds', SoundsSchema);

export default Sounds;
