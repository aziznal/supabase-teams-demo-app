import { Page } from "@/lib/client/components/layout/Page";
import { TeamsList } from "@/modules/teams/components/TeamsList";

export default async function MyTeamsPage() {
  return (
    <Page>
      <section className="mb-12">
        <h1 className="mb-4 text-2xl font-bold">Teams</h1>

        <TeamsList />
      </section>
    </Page>
  );
}
