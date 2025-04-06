import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let isConnected = false;

export async function connectMongoose() {
  if (isConnected) return;

  try {
    // eslint-disable-next-line no-console
    console.log('Connecting to database');
    const isMock = process.env.NODE_ENV !== 'production';

    let mongoUri: string;

    if (isMock) {
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    } else {
      mongoUri = process.env.MONGO_URI! || '';
    }

    await mongoose.connect(mongoUri);
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');
    isConnected = true;
  } catch (err) {
    console.error('Error', err);
  }
}
