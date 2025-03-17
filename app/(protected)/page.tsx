import { Page } from "@/lib/client/components/layout/Page";
import { ProjectsList } from "@/modules/projects/components/ProjectsList";
import { TeamsList } from "@/modules/teams/components/TeamsList";
import { getUserInfo } from "@/modules/user/actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getUserInfo();

  return (
    <Page>
      <div className="mb-12 text-3xl">
        Welcome, <span className="font-bold">{user.fullName}</span>
      </div>

      <section className="mb-12">
        <h1 className="mb-4 text-2xl font-bold">Teams</h1>

        <TeamsList />
      </section>

      <section>
        <h1 className="mb-4 text-2xl font-bold">Projects</h1>

        <ProjectsList />
      </section>
    </Page>
  );
}
