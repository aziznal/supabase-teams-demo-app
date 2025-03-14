import { eq, sql } from "drizzle-orm";
import {
  pgPolicy,
  pgTable,
  pgView,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { authUid, authUsers, authenticatedRole } from "drizzle-orm/supabase";

export const userProfileInfo = pgTable("user_profile_info", {
  id: uuid()
    .primaryKey()
    .notNull()
    .references(() => authUsers.id),
  fullName: text().notNull(),
});

export const usersView = pgView("users_view")
  .with({
    securityInvoker: true,
    securityBarrier: true,
  })
  .as((qb) => {
    const cte = qb.$with("cte").as(
      qb
        .select({
          id: authUsers.id,
          email: authUsers.email,
          createdAt: authUsers.createdAt,
          fullName: sql<string>`${userProfileInfo.fullName}`.as("full_name"),
        })
        .from(authUsers)
        .innerJoin(userProfileInfo, eq(authUsers.id, userProfileInfo.id)),
    );

    return qb.with(cte).select().from(cte);
  });

export const team = pgTable("team", {
  id: uuid().primaryKey().defaultRandom(),
});

export const team_users = pgTable(
  "team_users",
  {
    teamId: uuid()
      .notNull()
      .references(() => team.id),

    userId: uuid()
      .notNull()
      .references(() => authUsers.id),
  },
  (t) => [primaryKey({ columns: [t.teamId, t.userId] })],
);

export const project = pgTable("project", {
  id: uuid().primaryKey().defaultRandom(),
  content: text(),
});

// POLICIES

export const userProfileInfo_policy1 = pgPolicy(
  "allow authenticated users full access to profile info",
  {
    as: "permissive",
    to: authenticatedRole,
    for: "all",
    using: sql`${userProfileInfo.id} = ${authUid}`,
  },
).link(userProfileInfo);

const userIsTeamMember = sql`
  EXISTS ( SELECT 1 FROM ${team_users} WHERE ${team_users.userId} = ${authUid} AND ${team_users.teamId} = ${team.id} )`;

export const team_policy1 = pgPolicy("allow read for members", {
  as: "permissive",
  to: authenticatedRole,
  for: "select",
  using: userIsTeamMember,
}).link(team);

// TODO: add policy for write access
//
// TODO: add team_projects table
//
// TODO: add policies for project access
//
// TODO: add relations to be able to query with db.query
