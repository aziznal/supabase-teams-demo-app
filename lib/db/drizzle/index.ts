import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function db() {
  if (!process.env.DATABASE_URL)
    throw new Error("Missing DATABASE_URL env var");

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(process.env.DATABASE_URL, { prepare: false });
  return drizzle({ client });
}
