import { Page } from "@/lib/client/components/layout/Page";
import { createDrizzleSupabaseClient } from "@/lib/db/drizzle";
import { usersView } from "@/lib/db/drizzle/schema";

export const dynamic = "force-dynamic";

async function fetchUser() {
  "use server";

  const db = await createDrizzleSupabaseClient();

  const result = await db.rls((tx) => {
    return tx.select().from(usersView);
  });

  return result[0];
}

export default async function HomePage() {
  const result = await fetchUser();

  return <Page>Welcome, {result.fullName}</Page>;
}
