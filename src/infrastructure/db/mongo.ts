import mongoose from 'mongoose';
import { logger } from '../../utility/logger';

export async function connectMongo(uri: string) {
  try {
    await mongoose.connect(uri, {
      autoIndex: true,
    });
  } catch (error) {
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️  MongoDB disconnected");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    logger.info("🧹 MongoDB connection closed");
    process.exit(0);
  });
}

export async function disconnectMongo() {
  await mongoose.connection.close();
  logger.info("🧹 MongoDB connection closed manually");
}
