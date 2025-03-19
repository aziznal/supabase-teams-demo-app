export enum UserTeamRole {
  member = "member",
  admin = "admin",
  owner = "owner",
}

export const userTeamRolesList = Object.keys(UserTeamRole) as [UserTeamRole];
