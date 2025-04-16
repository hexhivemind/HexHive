import mongoose, { Schema, model, type Model } from 'mongoose';
import { applyAutoIncrement, AssetHives } from './Shared';
import { runtimeTypes } from '~/types/runtimeTypes.generated';

const ScriptsSchema = new Schema<ScriptData>({
  ...AssetHives,

  category: {
    type: [String],
    required: true,
    index: true,
  },
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

const Scripts: Model<ScriptData> =
  mongoose.models.Scripts || model<ScriptData>('Scripts', ScriptsSchema);

export default Scripts;
