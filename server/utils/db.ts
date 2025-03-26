import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let isConnected = false;

export async function connectMongoose() {
  if (isConnected) return;

  try {
    console.log('connecting to database');
    const isMock = process.env.NODE_ENV !== 'production';

    let mongoUri: string;

    if (isMock) {
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    } else {
      mongoUri = process.env.MONGO_URI! || '';
    }

    await mongoose.connect(mongoUri);
    isConnected = true;
  } catch (err) {
    console.error('Error', err);
  }
}
