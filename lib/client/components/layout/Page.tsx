import { cn } from "@/lib/client/utils";

export const Page: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = (props) => {
  return (
    <div
      className={cn("container mx-auto px-4 py-12 sm:px-0", props.className)}
    >
      {props.children}
    </div>
  );
};
