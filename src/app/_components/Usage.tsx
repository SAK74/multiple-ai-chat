import { cn } from "@/src/lib/utils";
import { type FC } from "react";
import { useUsage } from "./localStorage.hook";
import { Progress } from "@/src/components/ui/progress";
import { TOKENS_LIMIT } from "../_constants";

export const Usage: FC<{ className?: string }> = ({ className }) => {
  const { usage } = useUsage();
  const status = (usage / TOKENS_LIMIT) * 100;
  const content = "Free tier used tokens: " + usage;

  return (
    <div className={cn("relative", className)}>
      <div className="px-4 h-0">{content}</div>
      <Progress
        value={status}
        className={cn(
          "h-6 bg-secondary opacity-50 *:bg-green-500 border border-primary rounded-md",
          { "*:bg-yellow-500": status > 34 },
          { "*:bg-red-700": status > 67 }
        )}
      />
      <span className="absolute left-0 bottom-0 px-4">{content}</span>
    </div>
  );
};
