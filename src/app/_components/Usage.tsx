import { cn } from "@/src/lib/utils";
import { type FC } from "react";
import { useUsage } from "./localStorage.hook";

export const Usage: FC<{ className?: string }> = ({ className }) => {
  const { usage } = useUsage();
  return <div className={cn("", className)}>Total used tokens: {usage}</div>;
};
