import { Page } from "@/lib/client/components/layout/Page";
import { fetchUser } from "./action";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result = await fetchUser();

  return <Page>Welcome, {result.fullName}</Page>;
}
