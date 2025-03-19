import { relations } from "drizzle-orm";
import { uuid, primaryKey } from "drizzle-orm/pg-core";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";
import { team } from "./team";
import { user } from "./user";
import { userTeamRoles } from "@/modules/teams/user-role";

export const pgUserTeamRole = pgEnum("user_team_role", userTeamRoles);

export const teamUsers = pgTable(
  "team_users",
  {
    teamId: uuid("team_users_team_id")
      .notNull()
      .references(() => team.id),

    userId: uuid("team_users_user_id")
      .notNull()
      .references(() => authUsers.id),

    userRole: pgUserTeamRole("team_users_role").notNull(),
  },
  (t) => [primaryKey({ columns: [t.teamId, t.userId] })],
);

export const teamUsersRelations = relations(teamUsers, ({ one }) => ({
  user: one(user, {
    fields: [teamUsers.userId],
    references: [user.id],
  }),

  team: one(team, {
    fields: [teamUsers.teamId],
    references: [team.id],
  }),
}));
