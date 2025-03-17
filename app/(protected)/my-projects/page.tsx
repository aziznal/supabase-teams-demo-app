import { Page } from "@/lib/client/components/layout/Page";
import { ProjectsList } from "@/modules/projects/components/ProjectsList";

export default function MyProjectsPage() {
  return (
    <Page>
      <section className="mb-12">
        <h1 className="mb-4 text-2xl font-bold">Projects</h1>

        <ProjectsList />
      </section>
    </Page>
  );
}
