import { AvatarFallback, Avatar as AvatarUi } from "./ui/avatar";

export const Avatar = () => {
  return (
    <AvatarUi>
      <AvatarFallback>?</AvatarFallback>
    </AvatarUi>
  );
};
