"use client";

import { Page } from "@/lib/client/components/layout/Page";
import { Spinner } from "@/lib/client/components/Spinner";
import { useGetUserInfoQuery } from "@/modules/user/queries";

export default function MyProfilePage() {
  const userInfoQuery = useGetUserInfoQuery();

  if (userInfoQuery.isPending)
    return (
      <Page>
        <Spinner size={32} />
      </Page>
    );

  return (
    <Page>
      <section className="mb-12">
        <h1 className="mb-4 text-2xl font-bold">My Profile</h1>

        <div className="mb-4 flex items-center">
          <span className="text-muted-foreground w-[300px]">User Name</span>
          <div>{userInfoQuery.data?.fullName}</div>
        </div>

        <div className="flex items-center">
          <span className="text-muted-foreground w-[300px]">Email</span>
          <div>{userInfoQuery.data?.email}</div>
        </div>
      </section>
    </Page>
  );
}
