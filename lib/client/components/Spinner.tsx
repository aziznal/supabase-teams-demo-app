import { LucideLoader2 } from "lucide-react";
import { cn } from "../utils";

export const Spinner: React.FC<{ className?: string; size?: number }> = (
  props,
) => {
  return (
    <LucideLoader2
      className={cn("w-fit animate-spin", props.className)}
      size={props.size ?? 24}
    />
  );
};
