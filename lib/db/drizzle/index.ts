import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema/index";
import { sql } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { jwtDecode, JwtPayload } from "jwt-decode";

// @see https://orm.drizzle.team/docs/rls#using-with-supabase
// @see https://github.com/rphlmr/drizzle-supabase-rls

type SupabaseToken = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  role?: string;
};

function createDrizzle(
  token: SupabaseToken,
  {
    admin,
    client,
  }: {
    admin: PostgresJsDatabase<typeof schema>;
    client: PostgresJsDatabase<typeof schema>;
  },
) {
  return {
    admin,
    rls: (async (transaction, ...rest) => {
      return await client.transaction(
        async (tx) => {
          // Supabase exposes auth.uid() and auth.jwt()
          // https://supabase.com/docs/guides/database/postgres/row-level-security#helper-functions
          try {
            await tx.execute(sql`
          -- auth.jwt()
          select set_config('request.jwt.claims', '${sql.raw(
            JSON.stringify(token),
          )}', TRUE);
          -- auth.uid()
          select set_config('request.jwt.claim.sub', '${sql.raw(
            token.sub ?? "",
          )}', TRUE);												
          -- set local role
          set local role ${sql.raw(token.role ?? "anon")};
          `);
            return await transaction(tx);
          } finally {
            await tx.execute(sql`
            -- reset
            select set_config('request.jwt.claims', NULL, TRUE);
            select set_config('request.jwt.claim.sub', NULL, TRUE);
            reset role;
            `);
          }
        },
        ...rest,
      );
    }) as typeof client.transaction,
  };
}

export async function createDrizzleSupabaseClient() {
  if (!process.env.DATABASE_URL)
    throw new Error("Missing DATABASE_URL env var");

  // Bypass RLS
  const admin = drizzle<typeof schema>({
    client: postgres(process.env.DATABASE_URL, { prepare: false }),
  });

  // Protected by RLS
  const client = drizzle<typeof schema>({
    client: postgres(process.env.DATABASE_URL, { prepare: false }),
  });

  const {
    data: { session },
  } = await (await createClient()).auth.getSession();

  return createDrizzle(decode(session?.access_token ?? ""), { admin, client });
}

export function decode(accessToken: string) {
  try {
    return jwtDecode<JwtPayload & { role: string }>(accessToken);
  } catch (_error) {
    return { role: "anon" } as JwtPayload & { role: string };
  }
}
