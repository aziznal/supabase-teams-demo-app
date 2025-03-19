"use client";

import { cn } from "@/lib/client/utils";
import { useGetUserProjectsQuery } from "../queries";
import { Spinner } from "@/lib/client/components/Spinner";

export const ProjectsList: React.FC<{ className?: string }> = (props) => {
  const projectsQuery = useGetUserProjectsQuery();

  if (projectsQuery.isPending)
    return (
      <div>
        <Spinner size={32} />
      </div>
    );

  return (
    <>
      {projectsQuery.isSuccess && (
        <div className={cn("flex flex-wrap gap-3", props.className)}>
          {projectsQuery.data.map((project) => (
            <div
              key={project.id}
              className="flex w-[300px] flex-col gap-2 rounded-lg border border-lime-500 p-4"
            >
              <div className="text-muted-foreground text-sm">
                team: {project.teamName}{" "}
                <span className="text-muted-foreground">
                  ({project.teamRole})
                </span>
              </div>

              <div className="text-lg font-bold">{project.name}</div>

              <div className="text-muted-foreground">{project.content}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
