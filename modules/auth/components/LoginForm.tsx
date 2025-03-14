"use client";

import { cn } from "@/lib/client/utils";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm as LoginFormType, loginFormSchema } from "../schemas";
import { Form } from "@/lib/client/components/ui/form";

export const LoginForm: React.FC<{ className?: string }> = (props) => {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
  });

  return (
    <div className={cn(props.className)}>
      <Form {...form}>
        <form>Login Form</form>
      </Form>
    </div>
  );
};
