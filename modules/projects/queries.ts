import { useQuery } from "@tanstack/react-query";
import { getUserProjects } from "./actions/get-user-projects";

export const projectQueryKeyFactory = {
  all: ["project"],
} as const;

export const useGetUserProjectsQuery = () =>
  useQuery({
    queryFn: () => getUserProjects(),
    queryKey: projectQueryKeyFactory.all,
  });
