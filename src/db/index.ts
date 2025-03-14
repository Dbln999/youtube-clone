import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

dotenv.config({
  path: ".env.local",
});
console.log(process.env.DATABASE_URL);
export const db = drizzle(process.env.DATABASE_URL!);
