import { LucideLoader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <LucideLoader2 className="animate-spin w-fit" size="32" />
    </div>
  );
}
