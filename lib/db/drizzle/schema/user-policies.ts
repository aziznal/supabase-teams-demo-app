import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";
import { user } from "./user";

export const user_policy1 = pgPolicy(
  "allow authenticated users full access to their info",
  {
    as: "permissive",
    to: authenticatedRole,
    for: "all",
    using: sql`${user.id} = ${authUid}`,
  },
).link(user);
