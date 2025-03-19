import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";
import { team } from "./team";
import { teamUsers } from "./team-users";
import { UserTeamRole } from "@/modules/teams/user-role";

const userIsTeamMember = sql`
  EXISTS 
   (
    SELECT 1 

    FROM ${teamUsers} 

    WHERE ${teamUsers.userId} = ${authUid} 
      AND ${teamUsers.teamId} = ${team.id}
  )
`;

const userIsTeamAdmin = sql`
  EXISTS 
   (
    SELECT 1 

    FROM ${teamUsers} 

    WHERE ${teamUsers.userId} = ${authUid} 
      AND ${teamUsers.teamId} = ${team.id} 
      AND ${teamUsers.userRole} = '${sql.raw(UserTeamRole.admin)}'
  )
`;

const userIsTeamOwner = sql`
  EXISTS 
   (
    SELECT 1 

    FROM ${teamUsers} 

    WHERE ${teamUsers.userId} = ${authUid} 
      AND ${teamUsers.teamId} = ${team.id} 
      AND ${teamUsers.userRole} = '${sql.raw(UserTeamRole.owner)}'
  )
`;

const userIsTeamAdminOrOwner = sql`${userIsTeamAdmin} OR ${userIsTeamOwner}`;

const userHasBelowMaxTeamLimit = sql`
  (
    SELECT COUNT(*)

    FROM ${teamUsers}

    WHERE ${teamUsers.userId} = ${authUid}
      AND ${teamUsers.userRole} = '${sql.raw(UserTeamRole.admin)}'
  ) <= 3
`;

export const policy_teamRead = pgPolicy("allow read for members", {
  as: "permissive",
  to: authenticatedRole,
  for: "select",
  using: userIsTeamMember,
}).link(team);

export const policy_teamCreate = pgPolicy(
  "allow any authenticated user to create a team, up until 3 teams",
  {
    as: "permissive",
    to: authenticatedRole,
    for: "insert",
    withCheck: userHasBelowMaxTeamLimit,
  },
).link(team);

export const policy_teamUpdate = pgPolicy(
  "allow admins or owners to update their teams",
  {
    as: "permissive",
    to: authenticatedRole,
    for: "update",
    withCheck: userIsTeamAdminOrOwner,
  },
).link(team);

export const policy_teamDelete = pgPolicy(
  "allow owners to delete their teams",
  {
    as: "permissive",
    to: authenticatedRole,
    for: "delete",
    using: userIsTeamOwner,
  },
).link(team);

