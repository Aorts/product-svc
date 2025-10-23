

import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	PORT: z.coerce.number().int().positive().default(3000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("❌ Invalid environment variables:", z.treeifyError(parsedEnv.error));
	throw new Error("Invalid environment variables");
}

export const config = {
  PORT: parsedEnv.data.PORT,
  MONGO_URI: String(parsedEnv.data.MONGO_URI),
};