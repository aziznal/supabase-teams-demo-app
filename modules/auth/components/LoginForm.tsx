"use client";

import { cn } from "@/lib/client/utils";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm as LoginFormType, loginFormSchema } from "../schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/lib/client/components/ui/form";
import { Input } from "@/lib/client/components/ui/input";
import { Button } from "@/lib/client/components/ui/button";
import { useLoginMutation } from "../queries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const LoginForm: React.FC<{ className?: string }> = (props) => {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "abodenaal@gmail.com",
      password: "@PAssword123!",
    },
  });

  const router = useRouter();

  const loginMutation = useLoginMutation({
    onSuccess: () => {
      toast.success("Login successful. You will be automatically redirected");
      router.push("/");
    },

    onError: (error) => {
      toast.error(`Failed to login: ${error}`);
      router.push("/");
    },
  });

  const attemptLogin = (values: LoginFormType) => {
    if (loginMutation.isPending) return;
    toast("Logging you in ...");
    loginMutation.mutate(values);
  };

  return (
    <div className={cn(props.className)}>
      <Form {...form}>
        <form
          className="flex w-full flex-col gap-6 sm:min-w-[300px]"
          onSubmit={form.handleSubmit(attemptLogin)}
        >
          <h1 className="text-xl font-black text-green-600">Login</h1>

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
            className="w-fit self-end bg-green-500 hover:bg-green-400"
            disabled={loginMutation.isPending || loginMutation.isSuccess}
          >
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};
