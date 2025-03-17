"use server";

import { createDrizzleSupabaseClient } from "@/lib/db/drizzle";
import { usersView } from "@/lib/db/drizzle/schema";

export async function getUserInfo() {
  const db = await createDrizzleSupabaseClient();

  const result = await db.rls((tx) => {
    return tx.select().from(usersView);
  });

  return result[0];
}
