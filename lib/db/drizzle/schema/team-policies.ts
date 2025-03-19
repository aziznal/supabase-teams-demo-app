import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";
import { team } from "./team";
import { teamUsers } from "./team-users";

const userIsTeamMember = sql`
  EXISTS ( SELECT 1 FROM ${teamUsers} WHERE ${teamUsers.userId} = ${authUid} AND ${teamUsers.teamId} = ${team.id} )`;

const userIsTeamAdmin = sql`${userIsTeamMember}`;
const userIsTeamOwner = sql`${userIsTeamMember}`;
const userIsTeamAdminOrOwner = sql`${userIsTeamAdmin} OR ${userIsTeamOwner}`;

export const policy_teamRead = pgPolicy("allow read for members", {
  as: "permissive",
  to: authenticatedRole,
  for: "select",
  using: userIsTeamMember,
}).link(team);

export const policy_teamCreate = pgPolicy(
  "allow any authenticated user to create a team",
  {
    as: "permissive",
    to: authenticatedRole,
    for: "select",
  },
).link(team);

// export const policy_teamUpdate = pgPolicy(
//   "allow admins or owners to update their teams",
//   {
//     as: "permissive",
//     to: authenticatedRole,
//     for: "update",
//     using: userIsTeamAdminOrOwner,
//   },
// ).link(team);
//
// export const policy_teamDelete = pgPolicy(
//   "allow admins or owners to update their teams",
//   {
//     as: "permissive",
//     to: authenticatedRole,
//     for: "delete",
//     using: userIsTeamAdminOrOwner,
//   },
// ).link(team);
