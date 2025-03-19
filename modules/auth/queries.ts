"use client";

import { createClient } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { LoginForm } from "./schemas";
import { createUser } from "./actions/create-user";
import { queryClient } from "@/lib/client/tanstack-query-client";

export const useLoginMutation = (options: {
  onSuccess: () => void;
  onError: (error: Error) => void;
}) =>
  useMutation({
    mutationFn: async (args: LoginForm) => {
      const supabase = createClient();

      const result = await supabase.auth.signInWithPassword({
        email: args.email,
        password: args.password,
      });

      if (result.error) throw new Error("Login failed.", result.error);
    },
    onSuccess: options.onSuccess,
    onError: options.onError,
  });

export const useSignupMutation = (options: {
  onSuccess: () => void;
  onError: (error: Error) => void;
}) =>
  useMutation({
    mutationFn: createUser,
    onSuccess: options.onSuccess,
    onError: options.onError,
  });

export const useLogoutMutation = (options: {
  onSuccess: () => void;
  onError: (error: Error) => void;
}) =>
  useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      const result = await supabase.auth.signOut();
      queryClient.clear();

      if (result.error)
        throw new Error("Error while signing out.", result.error);
    },
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
