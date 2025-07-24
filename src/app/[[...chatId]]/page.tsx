import { cookies } from "next/headers";
import { SidebarProvider } from "../../components/ui/sidebar";
import { SideBarComp } from "../_components/sidebar/SideBar";
import { Chat } from "../_components/Chat";
import { SideBarTrigger } from "../_components/SideTrigger";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { db } from "@/src/lib/prisma";
import { Message } from "ai";

export default async function Page({
  params,
}: {
  params: Promise<{ chatId?: string[] | string }>;
}) {
  const cookiesState = await cookies();
  const isSidebarOpened = cookiesState.get("sidebar_state")?.value === "true";

  const resolvedChatParam = (await params).chatId;

  const chatId = Array.isArray(resolvedChatParam)
    ? resolvedChatParam[0]
    : resolvedChatParam;

  const user = (await auth())?.user;

  if (user && !chatId) {
    redirect(`/${randomUUID()}`);
  }
  if (!user && chatId) {
    redirect("/");
  }
  const initialMessages = chatId
    ? ((
        await db.chat.findUnique({
          where: { id: chatId },
          select: { messages: { omit: { chatId: true } } },
        })
      )?.messages.map((message) => ({
        ...message,
        createdAt: message.createdAt ? message.createdAt : undefined,
      })) as Message[])
    : undefined;

  return (
    <SidebarProvider defaultOpen={isSidebarOpened}>
      <SideBarComp userId={user?.id} chatId={chatId} />
      <SideBarTrigger />
      <Chat chatId={chatId} user={user} initialMessages={initialMessages} />
    </SidebarProvider>
  );
}

// export const dynamic = "force-dynamic";
