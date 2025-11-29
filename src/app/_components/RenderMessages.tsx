import type { Message, UIMessage } from "ai";
import { memo, useCallback, type FC } from "react";

import { removMessFromChat } from "@/src/actions/removeMessFromChat";
import { MemoizedMessage } from "./Message";

type RenderMessagesProps = {
  messages: UIMessage[];
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
  chatId?: string;
};

const RenderedMessages: FC<RenderMessagesProps> = ({
  messages,
  setMessages,
  chatId,
}) => {
  const deleteMessage = useCallback(
    (id: Message["id"]) => {
      setMessages((messages) => messages.filter((mess) => mess.id !== id));
      if (chatId) {
        removMessFromChat(chatId, id);
      }
    },
    [setMessages, chatId]
  );

  return (
    <>
      {messages
        .sort(
          (a, b) =>
            (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0)
        )
        .map((message) => (
          <MemoizedMessage
            key={message.id}
            message={message}
            onDelete={deleteMessage}
          />
        ))}
    </>
  );
};

export const RenderMessages = memo(RenderedMessages);
