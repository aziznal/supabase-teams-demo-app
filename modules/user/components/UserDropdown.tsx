"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/client/components/ui/popover";
import { cn } from "@/lib/client/utils";
import { useGetUserInfoQuery } from "../queries";
import { LogoutButton } from "@/modules/auth/components/LogoutButton";
import {
  LucideBoxes,
  LucideUser,
  LucideUser2,
  LucideUsers,
} from "lucide-react";
import { Spinner } from "@/lib/client/components/Spinner";
import { Separator } from "@/lib/client/components/ui/separator";
import Link from "next/link";
import { useState } from "react";

export const UserDropdown: React.FC<{ className?: string }> = (props) => {
  const userInfoQuery = useGetUserInfoQuery();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const closeUserDropdown = () => setIsDropdownOpen(false);

  return (
    <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <PopoverTrigger
        className={cn(props.className)}
        disabled={userInfoQuery.isPending}
      >
        <div className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full border-2 border-blue-500 hover:bg-neutral-700">
          {userInfoQuery.isPending && <Spinner size={16} />}

          {userInfoQuery.isSuccess && (
            <LucideUser className="shrink-0" size="18" />
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        className="flex flex-col"
        onClick={closeUserDropdown}
      >
        <span className="mb-1">{userInfoQuery.data?.fullName}</span>

        <span className="text-muted-foreground mb-3">
          {userInfoQuery.data?.email}
        </span>

        <Separator className="mb-3" />

        <div className="mb-3 flex flex-col">
          <DropdownLink href="/my-profile">
            <LucideUser2 size="18" />
            My Profile
          </DropdownLink>

          <DropdownLink href="/my-teams">
            <LucideUsers size="18" />
            My Teams
          </DropdownLink>

          <DropdownLink href="/my-projects">
            <LucideBoxes size="18" />
            My Projects
          </DropdownLink>
        </div>

        <Separator className="mb-3" />

        <LogoutButton className="self-end" />
      </PopoverContent>
    </Popover>
  );
};

const DropdownLink: React.FC<{
  className?: string;
  href: string;
  children: React.ReactNode;
}> = (props) => {
  return (
    <Link
      className={cn(
        "flex items-center gap-2 rounded px-2 py-2 hover:bg-neutral-800",
        props.className,
      )}
      href={props.href}
    >
      {props.children}
    </Link>
  );
};
