import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./lib/db/drizzle/remote/",
  schema: "./lib/db/drizzle/schema/index.ts",
  dialect: "postgresql",
  casing: "snake_case",
  strict: true,
  entities: {
    roles: true,
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
