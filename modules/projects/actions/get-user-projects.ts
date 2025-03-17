"use server";

import { createDrizzleSupabaseClient } from "@/lib/db/drizzle";
import { userProjectsView } from "@/lib/db/drizzle/schema";

export async function getUserProjects() {
  const db = await createDrizzleSupabaseClient();

  const result = await db.rls((tx) => {
    return tx.select().from(userProjectsView);
  });

  return result;
}
