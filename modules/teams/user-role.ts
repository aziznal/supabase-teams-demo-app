export enum UserTeamRole {
  member = "member",
  admin = "admin",
  owner = "owner",
}

export const userTeamRoles = Object.keys(UserTeamRole) as [UserTeamRole];
