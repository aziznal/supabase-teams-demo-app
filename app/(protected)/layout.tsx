// auth check is done in middleware

import { LogoutButton } from "@/modules/auth/components/LogoutButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LogoutButton className="absolute top-4 right-4" />

      {children}
    </>
  );
}
