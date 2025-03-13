import { cn } from "@/lib/utils";

export const Page: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = (props) => {
  return (
    <div className={cn("container py-12", props.className)}>
      {props.children}
    </div>
  );
};
