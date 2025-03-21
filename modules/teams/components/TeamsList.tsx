"use client";

import { cn } from "@/lib/client/utils";
import { useGetUserTeamsQuery } from "../queries";
import { Spinner } from "@/lib/client/components/Spinner";

export const TeamsList: React.FC<{ className?: string }> = (props) => {
  const teamsQuery = useGetUserTeamsQuery();

  if (teamsQuery.isPending)
    return (
      <div>
        <Spinner size={32} />
      </div>
    );

  return (
    <>
      {teamsQuery.isSuccess && (
        <div className={cn("flex flex-col gap-3", props.className)}>
          {teamsQuery.data.map((team) => (
            <div
              key={team.teamId}
              className="flex flex-col gap-2 rounded-lg border border-violet-500 p-4"
            >
              <div className="flex items-center gap-1">
                {team.teamName}
                <span className="text-muted-foreground">({team.teamRole})</span>
              </div>
              <div>{team.projectsCount} projects</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
