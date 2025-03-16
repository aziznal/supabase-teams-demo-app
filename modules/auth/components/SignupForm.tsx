"use client";

import { cn } from "@/lib/client/utils";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { signupFormSchema, SignupForm as SignupFormType } from "../schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/lib/client/components/ui/form";
import { Input } from "@/lib/client/components/ui/input";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "../queries";
import { toast } from "sonner";
import { Button } from "@/lib/client/components/ui/button";

export const SignupForm: React.FC<{ className?: string }> = (props) => {
  const form = useForm<SignupFormType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      fullName: "Aziz",
      email: "abodenaal@gmail.com",
      password: "@PAssword123!",
    },
  });

  const router = useRouter();

  const signupMutation = useSignupMutation({
    onSuccess: () => {
      toast.success("Sign up successful. You will be automatically redirected");
      router.push("/");
    },

    onError: (error) => {
      toast.error(`Failed to signup: ${error}`);
      router.push("/");
    },
  });

  const attemptSignup = (values: SignupFormType) => {
    if (signupMutation.isPending) return;
    toast("Signing up ...");
    signupMutation.mutate(values);
  };

  return (
    <div className={cn(props.className)}>
      <Form {...form}>
        <form
          className="flex w-full flex-col gap-6 sm:min-w-[300px]"
          onSubmit={form.handleSubmit(attemptSignup)}
        >
          <h1 className="text-xl font-black text-blue-600">Signup</h1>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="User name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-fit self-end bg-blue-500 hover:bg-blue-400"
            disabled={signupMutation.isPending || signupMutation.isSuccess}
          >
            Sign up
          </Button>
        </form>
      </Form>
    </div>
  );
};
