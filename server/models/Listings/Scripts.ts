import mongoose, { Schema, model, type Model } from 'mongoose';
import { applyAutoIncrement, AssetHives } from './Shared';
import { runtimeTypes } from '~/types/runtimeTypes.generated';

const ScriptsSchema = new Schema<ScriptsData>({
  ...AssetHives,

  features: {
    type: [String],
    require: true,
    index: true,
  },
  prerequisites: {
    type: [String],
  },
  targetedVersions: {
    type: [String],
    required: true,
    enum: runtimeTypes.SupportedBaseRomVersion,
    index: true,
  },
  tools: {
    type: [String],
    required: true,
    index: true,
  },
});

ScriptsSchema.index(
  { prerequisites: 1 },
  {
    unique: true,
    partialFilterExpression: {
      prerequisites: { $exists: true, $type: 'string' },
    },
  },
);

applyAutoIncrement(ScriptsSchema, 'Scripts');

const Scripts: Model<ScriptsData> =
  mongoose.models.Scripts || model<ScriptsData>('Scripts', ScriptsSchema);

export default Scripts;
