// auth check is done in middleware

import { LogoutButton } from "@/modules/auth/components/LogoutButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="container flex justify-end py-4 mx-auto">
        <LogoutButton />
      </header>

      {children}
    </>
  );
}
