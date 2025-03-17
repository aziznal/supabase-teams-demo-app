"use client";

import { UserDropdown } from "@/modules/user/components/UserDropdown";
import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header className="container mx-auto flex items-center justify-between border-b py-5">
      <Link
        href="/"
        className="text-muted-foreground font-bold hover:text-amber-400 cursor-pointer"
      >
        Home
      </Link>

      <UserDropdown />
    </header>
  );
};
