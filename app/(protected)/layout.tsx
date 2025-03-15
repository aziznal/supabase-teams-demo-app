// auth check is done in middleware

import { LogoutButton } from "@/modules/auth/components/LogoutButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="container flex justify-end p-4">
        <LogoutButton />
      </header>

      {children}
    </>
  );
}
