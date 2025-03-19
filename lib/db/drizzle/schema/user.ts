import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { authUsers } from "drizzle-orm/supabase";

import { teamUsers } from ".";

export const user = pgTable("user", {
  id: uuid("user_id")
    .primaryKey()
    .notNull()
    .references(() => authUsers.id),
  fullName: text("user_full_name").notNull(),
});

export const userRelations = relations(user, ({ one, many }) => ({
  authUser: one(authUsers, {
    fields: [user.id],
    references: [authUsers.id],
  }),

  teamUsers: many(teamUsers),
}));
