import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { teamProjects, teamUsers } from ".";

export const team = pgTable("team", {
  id: uuid("team_id").primaryKey().defaultRandom(),
  name: text("team_name").notNull().default(""),
});

export const teamRelations = relations(team, ({ many }) => ({
  teamUsers: many(teamUsers),
  teamProjects: many(teamProjects),
}));
