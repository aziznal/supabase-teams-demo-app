import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { team, project } from ".";

export const teamProjects = pgTable(
  "team_projects",
  {
    teamId: uuid("team_projects_team_id")
      .notNull()
      .references(() => team.id),

    projectId: uuid("team_projects_project_id")
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
