import { Page } from "@/lib/client/components/layout/Page";
import {
  fetchUser,
  fetchUserProjects,
  fetchUserTeams,
} from "@/modules/home-page/actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await fetchUser();
  const teams = await fetchUserTeams();
  const projects = await fetchUserProjects();

  return (
    <Page>
      <div className="mb-12 text-3xl">
        Welcome, <span className="font-bold">{user.fullName}</span>
      </div>

      <section className="mb-12">
        <h1 className="mb-4 text-2xl font-bold">Teams</h1>

        {teams.map((team) => (
          <div
            key={team.teamId}
            className="flex flex-col gap-2 rounded-lg border p-4"
          >
            <div>{team.teamName}</div>
            <div>{team.projectsCount} projects</div>
          </div>
        ))}
      </section>

      <section>
        <h1 className="mb-4 text-2xl font-bold">Projects</h1>

        <div>
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-2 rounded-lg border p-4"
            >
              <div className="text-muted-foreground text-sm">
                team: {project.teamName}
              </div>

              <div className="text-lg font-bold">{project.name}</div>

              <div className="text-muted-foreground">{project.content}</div>
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}
