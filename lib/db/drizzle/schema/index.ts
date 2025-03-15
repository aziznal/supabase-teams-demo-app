import { eq, relations, sql } from "drizzle-orm";
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
  fullName: text("full_name").notNull(),
});

export const userProfileInfoRelations = relations(
  userProfileInfo,
  ({ one, many }) => ({
    authUser: one(authUsers, {
      fields: [userProfileInfo.id],
      references: [authUsers.id],
    }),

    teamUsers: many(teamUsers),
  }),
);

export const usersView = pgView("users_view").as((qb) => {
  const cte = qb.$with("cte").as(
    qb
      .select({
        id: authUsers.id,
        email: authUsers.email,
        createdAt: authUsers.createdAt,

        // TODO: why is this weirdness necessary?
        // fullName: sql<string>`${userProfileInfo.fullName}`.as("full_name"),
        fullName: userProfileInfo.fullName,
      })
      .from(authUsers)
      .innerJoin(userProfileInfo, eq(authUsers.id, userProfileInfo.id))

      // NOTE: must re-apply RLS policy since there's a join in this view
      .where(eq(userProfileInfo.id, authUid)),
  );

  return qb.with(cte).select().from(cte);
});

export const team = pgTable("team", {
  id: uuid().primaryKey().defaultRandom(),
});

export const teamRelations = relations(team, ({ many }) => ({
  teamUsers: many(teamUsers),
  teamProjects: many(teamProjects),
}));

export const teamUsers = pgTable(
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

export const teamUsersRelations = relations(teamUsers, ({ one }) => ({
  userProfileInfo: one(userProfileInfo, {
    fields: [teamUsers.userId],
    references: [userProfileInfo.id],
  }),

  team: one(team, {
    fields: [teamUsers.teamId],
    references: [team.id],
  }),
}));

export const project = pgTable("project", {
  id: uuid().primaryKey().defaultRandom(),
  content: text(),
});

export const projectRelations = relations(project, ({ many }) => ({
  teamProjects: many(teamProjects),
}));

export const teamProjects = pgTable(
  "team_projects",
  {
    teamId: uuid()
      .notNull()
      .references(() => team.id),

    projectId: uuid()
      .notNull()
      .references(() => project.id),
  },
  (t) => [
    primaryKey({
      columns: [t.teamId, t.projectId],
    }),
  ],
);

export const teamProjectsRelations = relations(teamProjects, ({ one }) => ({
  team: one(team, {
    fields: [teamProjects.teamId],
    references: [team.id],
  }),

  project: one(project, {
    fields: [teamProjects.projectId],
    references: [project.id],
  }),
}));

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
  EXISTS ( SELECT 1 FROM ${teamUsers} WHERE ${teamUsers.userId} = ${authUid} AND ${teamUsers.teamId} = ${team.id} )`;

export const team_policy1 = pgPolicy("allow read for members", {
  as: "permissive",
  to: authenticatedRole,
  for: "select",
  using: userIsTeamMember,
}).link(team);

// TODO: add policy for write access
//
// TODO: add policies for project access
//
