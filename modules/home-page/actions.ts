"use server";

import { createDrizzleSupabaseClient } from "@/lib/db/drizzle";
import { userProjectsView, usersView, userTeamsView } from "@/lib/db/drizzle/schema";

export async function fetchUser() {
  const db = await createDrizzleSupabaseClient();

  const result = await db.rls((tx) => {
    return tx.select().from(usersView);
  });

  return result[0];
}

export async function fetchUserTeams() {
  const db = await createDrizzleSupabaseClient();

  const result = await db.rls((tx) => {
    return tx.select().from(userTeamsView);
  });

  return result;
}

export async function fetchUserProjects() {
  const db = await createDrizzleSupabaseClient();

  const result = await db.rls((tx) => {
    return tx.select().from(userProjectsView);
  });

  return result;
}
