import { Header } from "@/lib/client/header/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      {children}
    </>
  );
}
