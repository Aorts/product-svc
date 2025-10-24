import express from "express";
import { config } from "./config/config";
import { connectMongo, disconnectMongo } from "./infrastructure/db/mongo";
import { logger } from "./utility/logger";
import { buildRouter } from "./internal/api/route/route";
import { MongooseProductRepository } from "./internal/repository/product/repository";
import {
  errorMiddleware,
  requestLogger,
} from "./internal/api/middleware/middleware";
import { docsRouter } from "./api-docs/router";

async function main() {
  await connectMongo(config.MONGO_URI);
  const app = express();
  app.use(express.json());
  app.use(docsRouter());
  app.use(requestLogger);

  app.use(buildRouter(new MongooseProductRepository()));
  app.use(errorMiddleware);

  const server = app.listen(config.PORT, () =>
    logger.info({ port: config.PORT }, "http server started"),
  );

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "shutting down...");
    server.close(async () => {
      await disconnectMongo();
      logger.info("disconnected from MongoDB");
      process.exit(0);
    });

    setTimeout(async () => {
      await disconnectMongo().catch(() => {});
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
