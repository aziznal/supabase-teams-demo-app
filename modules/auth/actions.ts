"use server";

import { createClient } from "@/lib/supabase/server";
import { SignupForm } from "./schemas";
import {
  team,
  teamUsers,
  userProfileInfo,
} from "@/lib/db/drizzle/schema/index";
import { createDrizzleSupabaseClient } from "@/lib/db/drizzle";

export async function createUser(args: SignupForm) {
  const db = await createDrizzleSupabaseClient();

  const supabase = await createClient();

  const signupResult = await supabase.auth.signUp({
    email: args.email,
    password: args.password,
  });

  if (signupResult.error) {
    throw new Error(
      "Something went wrong while signing up",
      signupResult.error,
    );
  }

  await db.admin.transaction(async (tx) => {
    if (!signupResult.data.user || !signupResult.data.session) {
      throw new Error("An unknown error occurred while signing up");
    }

    await tx
      .insert(userProfileInfo)
      .values({
        id: signupResult.data.user.id,
        fullName: args.fullName,
      })
      .onConflictDoUpdate({
        set: {
          fullName: args.fullName,
        },
        target: [userProfileInfo.id],
      });

    // create the user's initial team
    const teamCreationResult = await tx
      .insert(team)
      .values({
        name: `${args.fullName}'s Team`,
      })
      .returning({
        teamId: team.id,
      });

    await tx.insert(teamUsers).values({
      teamId: teamCreationResult[0].teamId,
      userId: signupResult.data.user.id,
    });
  });
}
