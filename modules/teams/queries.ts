import { useQuery } from "@tanstack/react-query";
import { getUserTeams } from "./actions/get-user-teams";

export const teamQueryKeyFactory = {
  all: ["team"],
} as const;

export const useGetUserTeamsQuery = () =>
  useQuery({
    queryFn: () => getUserTeams(),
    queryKey: teamQueryKeyFactory.all,
  });
