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
import { signIn, signOut } from "next-auth/react";
import type { FC } from "react";
import type { User } from "next-auth";

export const UserIcon: FC<{ user?: User }> = ({ user }) => {
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
          {user?.image && <AvatarImage src={user.image} />}
          <AvatarFallback>{user?.email?.slice(0, 2) ?? "?"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onLogin} disabled={!!user}>
          Login by github
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout} disabled={!user}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
