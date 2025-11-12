import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: process.env.MONGO_DB_NAME,
    });
    console.log('✅ MongoDB conectado correctamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
  }
}