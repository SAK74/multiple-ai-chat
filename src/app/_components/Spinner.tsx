import { cn } from "@/src/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { FC } from "react";

type SpinnerProps = {
  className?: string;
};

export const Spinner: FC<SpinnerProps> = ({ className }) => {
  return <LoaderCircleIcon className={cn("animate-spin", className)} />;
};
