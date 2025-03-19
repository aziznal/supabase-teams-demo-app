import { sql, eq, count } from "drizzle-orm";
import { pgView } from "drizzle-orm/pg-core";
import { authUid, authUsers } from "drizzle-orm/supabase";
import { project, team, teamProjects, teamUsers, user } from ".";

export const usersView = pgView("users_view").as((qb) => {
  const cte = qb.$with("cte").as(
    qb
      .select({
        id: authUsers.id,
        email: authUsers.email,
        createdAt: authUsers.createdAt,
        fullName: sql<string>`${user.fullName}`.as("full_name"),
      })
      .from(authUsers)
      .innerJoin(user, eq(authUsers.id, user.id))

      // NOTE: must re-apply a check like in the RLS policy since there's a join in this view. Source: trust me bro
      .where(eq(user.id, authUid)),
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
        name: sql<string>`${project.name}`.as("project_name"),
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
        sql`${project.name}`.as("project_name"),
        project.content,
      ),
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
