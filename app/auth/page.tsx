import { Page } from "@/lib/client/components/layout/Page";
import { Separator } from "@/lib/client/components/ui/separator";
import { LoginForm } from "@/modules/auth/components/LoginForm";
import { SignupForm } from "@/modules/auth/components/SignupForm";

export default function AuthPage() {
  return (
    <Page className="flex h-[100dvh] min-h-0 flex-col items-center justify-center gap-12 sm:flex-row">
      <SignupForm />

      <Separator
        orientation="vertical"
        className="hidden max-h-[300px] sm:block"
      />
      <Separator orientation="horizontal" className="max-h-[300px] sm:hidden" />

      <LoginForm />
    </Page>
  );
}
