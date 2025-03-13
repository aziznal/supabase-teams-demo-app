import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const userProfileInfo = pgTable("user_profile_info", {
  id: uuid().primaryKey().defaultRandom(),
  fullName: text().notNull(),
});
