import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";

export const UserIcon = () => {
  const { data } = useSession();

  const onLogin = () => {
    signIn("github", {});
  };

  const onLogout = () => {
    signOut({ redirectTo: "/" });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {data?.user?.image && <AvatarImage src={data.user.image} />}
          <AvatarFallback>
            {data?.user?.email?.slice(0, 2) ?? "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onLogin} disabled={!!data}>
          Login by github
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout} disabled={!data}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
