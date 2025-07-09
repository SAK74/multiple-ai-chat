import { clsx, type ClassValue } from "clsx";
import { type ExternalToast, toast as sonner } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SonnerTypes = Extract<
  keyof typeof sonner,
  "success" | "info" | "warning" | "error"
>;
const toastType: ExternalToast = {
  duration: 6000,
  richColors: true,
  closeButton: true,
  position: "top-center",
};
export const dropToast = (
  message: Parameters<(typeof sonner)["success"]>[0],
  type: SonnerTypes,
  params?: ExternalToast
) => {
  const toast = sonner[type];
  toast(message, { ...toastType, ...params });
};
