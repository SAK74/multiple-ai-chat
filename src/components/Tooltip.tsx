import type {
  ComponentPropsWithRef,
  FC,
  PropsWithChildren,
  ReactNode,
} from "react";
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip as TooltipUi,
} from "./ui/tooltip";

type TooltipProps = ComponentPropsWithRef<"button"> & {
  label: ReactNode;
};

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({
  children,
  label,
  ...rest
}) => (
  <TooltipUi>
    <TooltipTrigger asChild {...rest}>
      {children}
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </TooltipUi>
);
