"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { queryClient } from "../tanstack-query-client";
import { Toaster } from "./ui/sonner";

export function Providers(props: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      <Toaster />
    </QueryClientProvider>
  );
}
