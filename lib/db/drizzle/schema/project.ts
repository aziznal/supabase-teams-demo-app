import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { teamProjects } from ".";

export const project = pgTable("project", {
  id: uuid("project_id").primaryKey().defaultRandom(),
  name: text("project_name").notNull().default(""),
  content: text("project_content").notNull().default(""),
});

export const projectRelations = relations(project, ({ many }) => ({
  teamProjects: many(teamProjects),
}));
