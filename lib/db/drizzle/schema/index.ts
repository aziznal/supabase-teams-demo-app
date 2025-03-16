import { count, eq, relations, sql } from "drizzle-orm";
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
  id: uuid("id")
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

export const team = pgTable("team", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().default(""),
});

export const teamRelations = relations(team, ({ many }) => ({
  teamUsers: many(teamUsers),
  teamProjects: many(teamProjects),
}));

export const teamUsers = pgTable(
  "team_users",
  {
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id),

    userId: uuid("user_id")
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
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().default(""),
  content: text("content").notNull().default(""),
});

export const projectRelations = relations(project, ({ many }) => ({
  teamProjects: many(teamProjects),
}));

export const teamProjects = pgTable(
  "team_projects",
  {
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id),

    projectId: uuid("project_id")
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

// VIEWS

export const usersView = pgView("users_view").as((qb) => {
  const cte = qb.$with("cte").as(
    qb
      .select({
        id: authUsers.id,
        email: authUsers.email,
        createdAt: authUsers.createdAt,
        fullName: sql<string>`${userProfileInfo.fullName}`.as("full_name"),
      })
      .from(authUsers)
      .innerJoin(userProfileInfo, eq(authUsers.id, userProfileInfo.id))

      // NOTE: must re-apply a check like in the RLS policy since there's a join in this view. Source: trust me bro
      .where(eq(userProfileInfo.id, authUid)),
  );

  return qb.with(cte).select().from(cte);
});

export const userTeamsView = pgView("user_teams_view").as((qb) => {
  const cte = qb.$with("cte").as(
    qb
      .select({
        teamId: teamUsers.teamId,
        teamName: team.name,
        projectsCount: count(teamProjects).as(`projectsCount`),
      })
      .from(teamUsers)
      .leftJoin(team, eq(teamUsers.teamId, team.id))
      .leftJoin(teamProjects, eq(teamProjects.teamId, team.id))
      .leftJoin(project, eq(project.id, teamProjects.projectId))

      // NOTE: must re-apply a check like in the RLS policy since there's a join in this view. Source: trust me bro
      .where(eq(teamUsers.userId, authUid))
      .groupBy(teamUsers.teamId, team.name),
  );

  return qb.with(cte).select().from(cte);
});

export const userProjectsView = pgView("user_projects_view").as((qb) => {
  const cte = qb.$with("cte").as(
    qb
      .select({
        teamId: teamUsers.teamId,
        teamName: team.name,
        id: project.id,
        name: sql<string>`${project.name}`.as('project_name'),
        content: project.content,
      })
      .from(teamUsers)
      .leftJoin(team, eq(teamUsers.teamId, team.id))
      .leftJoin(teamProjects, eq(teamProjects.teamId, team.id))
      .leftJoin(project, eq(project.id, teamProjects.projectId))

      // NOTE: must re-apply a check like in the RLS policy since there's a join in this view. Source: trust me bro
      .where(eq(teamUsers.userId, authUid))
      .groupBy(
        teamUsers.teamId,
        team.name,
        project.id,
        sql`${project.name}`.as('project_name'),
        project.content,
      ),
  );

  return qb.with(cte).select().from(cte);
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
