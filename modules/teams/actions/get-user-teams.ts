"use server";

import { createDrizzleSupabaseClient } from "@/lib/db/drizzle";
import { userTeamsView } from "@/lib/db/drizzle/schema";

export async function getUserTeams() {
  const db = await createDrizzleSupabaseClient();

  const result = await db.rls((tx) => {
    return tx.select().from(userTeamsView);
  });

  return result;
}
