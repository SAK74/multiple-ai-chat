import { cookies } from "next/headers";
import { SidebarProvider } from "../../components/ui/sidebar";
import { SideBarComp } from "../_components/sidebar/SideBar";
import { SideBarTrigger } from "../_components/SideTrigger";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { db } from "@/src/lib/prisma";
import { Message } from "ai";
import dynamic from "next/dynamic";
import { Spinner } from "../_components";

const Chat = dynamic(() => import("../_components/Chat").then((m) => m.Chat), {
  loading: () => (
    <main className="w-full flex justify-center items-center">
      <Spinner />
    </main>
  ),
});

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
    ? db.chat
        .findUnique({
          where: { id: chatId },
          select: { messages: { omit: { chatId: true } } },
        })
        .then((chat) => chat?.messages as Message[] | undefined)
    : Promise.resolve(undefined);

  return (
    <SidebarProvider defaultOpen={isSidebarOpened}>
      <SideBarComp userId={user?.id} chatId={chatId} />
      <SideBarTrigger />
      <Chat
        chatId={chatId}
        user={user}
        initialMessagesPromise={initialMessages}
      />
    </SidebarProvider>
  );
}

// export const dynamic = "force-dynamic";
