export const config = {
  PORT: Number(process.env.PORT ?? 3000),
  MONGO_URI: process.env.MONGO_URI ?? "mongodb://localhost:27017/products",
};