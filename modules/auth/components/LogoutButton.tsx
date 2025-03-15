"use client";

import { Button } from "@/lib/client/components/ui/button";
import { cn } from "@/lib/client/utils";
import { useLogoutMutation } from "../queries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const LogoutButton: React.FC<{ className?: string }> = (props) => {
  const router = useRouter();

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      toast.success("Logged out.");
      router.push("/auth");
    },
    onError: (error) => {
      toast.error(`Something went wrong while logging out. ${error}`);
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <Button
      variant="outline"
      className={cn(props.className)}
      onClick={logout}
      disabled={logoutMutation.isPending || logoutMutation.isSuccess}
    >
      Logout
    </Button>
  );
};
