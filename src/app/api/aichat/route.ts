import {
  appendClientMessage,
  appendResponseMessages,
  convertToCoreMessages,
  createDataStreamResponse,
  type Message,
  streamText,
} from "ai";
import { NextRequest } from "next/server";
import { getModel } from "./getModel";
import { Provider } from "../../types";
import { updateChat } from "./updateChat";
import { db } from "@/src/lib/prisma";
import { retrieveChatMessages } from "./retrieveChat";
import { FINISH_NOTIFICATION } from "../../_constants";

export async function POST(request: NextRequest) {
  try {
    const params = (await request.json()) as {
      messages?: Message[];
      system?: string;
      provider?: Provider;
      model?: string;
      apiKey?: string;
      id?: string;
      userId?: string;
      message: Message;
    };
    const {
      system,
      provider = "openai",
      model: modelId,
      apiKey,
      id,
      userId,
      message,
    } = params;
    let { messages } = params;

    if (process.env.NODE_ENV !== "production") {
      console.log({
        // messages: JSON.stringify(messages),
        message,
        system,
        provider,
        modelId,
        apiKey,
        id,
        userId,
      });
    }

    const model = getModel({ provider, modelId, apiKey });

    const dataStreamResponse = createDataStreamResponse({
      async execute(dataStream) {
        dataStream.writeData("Initiation..");
        dataStream.writeMessageAnnotation({ provider });

        if (id && userId) {
          dataStream.writeData("Retrieve chat history..");
          const prevMessages = (await retrieveChatMessages(
            id,
            userId
          )) as unknown as Message[];
          messages ??= appendClientMessage({
            messages: prevMessages ?? [],
            message,
          });
        }

        dataStream.writeData("Processing");
        const result = streamText({
          model,
          ...(system && { system }),
          messages: convertToCoreMessages(messages!),
          onFinish: async ({ response }) => {
            // console.log("Response: ", JSON.stringify(response.messages));
            dataStream.writeData("Saving to db");
            // update db
            if (id && userId) {
              const isOldChat = await db.chat.findUnique({ where: { id } });
              if (!isOldChat) {
                dataStream.writeData({ newChat: true });
              }
              await updateChat(
                userId,
                id,
                ...appendResponseMessages({
                  messages: [message],
                  responseMessages: response.messages,
                }).map((mess) => ({
                  ...mess,
                  ...(mess.role === "assistant" && {
                    annotations: [{ provider }],
                  }),
                }))
              );
            }

            dataStream.writeData(FINISH_NOTIFICATION);
          },
        });
        if (process.env.NODE_ENV !== "production") {
          result.usage.then((usage) => {
            console.log({ usage });
          });
          result.response.then(({ modelId }) => {
            console.log({ modelId });
          });
        }

        result.mergeIntoDataStream(dataStream);
      },
      onError(error) {
        if (error instanceof Error) {
          return error.message;
        }
        if (typeof error === "string") {
          return error;
        }
        if (error == null) {
          return "Unknown error...";
        }
        return JSON.stringify(error);
      },
    });

    return dataStreamResponse;
  } catch (error) {
    console.log(error);
    let message = "Unknown error...";
    switch (true) {
      case error instanceof Error:
        message = error.message;
        break;
      case typeof error === "string":
        message = error;
        break;
    }

    return new Response(message, { status: 500 });
  }
}
