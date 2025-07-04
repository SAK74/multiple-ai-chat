import type { FC, ComponentPropsWithRef } from "react";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  Select as SelectUi,
  SelectValue,
} from "./ui/select";
import { cn } from "../lib/utils";

type SelectProps = Omit<ComponentPropsWithRef<"button">, "value"> & {
  value?: string;
  onChange: (value: string) => void;
  size?: "sm" | "default";
  options: string[];
  optionsClassName?: string;
};

export const Select: FC<SelectProps> = ({
  value,
  onChange,
  size,
  options,
  optionsClassName,
  disabled,
  className,
}) => {
  return (
    <SelectUi value={value ?? options[0]} onValueChange={onChange}>
      <SelectTrigger
        size={size}
        disabled={disabled}
        className={cn("", className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className={cn("", optionsClassName)}>
        {options.map((name) => (
          <SelectItem key={name} value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectUi>
  );
};
