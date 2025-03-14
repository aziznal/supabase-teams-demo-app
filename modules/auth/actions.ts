"use server";

import { createClient } from "@/lib/supabase/server";
import { SignupForm } from "./schemas";
import { db } from "@/lib/db/drizzle";
import { userProfileInfo } from "@/lib/db/drizzle/schema/index";

export async function createUser(args: SignupForm) {
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

  // not a breaking change. just return
  if (!signupResult.data.user || !signupResult.data.session) {
    throw new Error("An unknown error occurred while signing up");
  }

  await db()
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

  // set it and forget it
  await supabase.auth.setSession(signupResult.data.session);
}
