import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "./actions";

export const userQueryKeyFactory = {
  all: ["user"],
} as const;

export const useGetUserInfoQuery = () =>
  useQuery({
    queryFn: () => getUserInfo(),
    queryKey: userQueryKeyFactory.all,
  });

