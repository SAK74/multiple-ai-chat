import {
  appendResponseMessages,
  createDataStreamResponse,
  Message,
  streamText,
} from "ai";
import { NextRequest } from "next/server";
import { getModel } from "./getModel";
import { Provider } from "../../types";
import { updateChat } from "./updateChat";
import { db } from "@/src/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // throw Error("New Test error");
    // console.log("cookies: ", request.cookies);

    const {
      messages,
      system,
      provider = "openai",
      model: modelId,
      apiKey,
      id,
      userId,
    } = (await request.json()) as {
      messages: Message[];
      system?: string;
      provider?: Provider;
      model?: string;
      apiKey?: string;
      id?: string;
      userId?: string;
    };
    if (process.env.NODE_ENV !== "production") {
      console.log({
        // messages: JSON.stringify(messages),
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
        // const test = await new Promise<string>((resolve) => {
        //   setTimeout(() => {
        //     resolve("Test phase...");
        //   }, 500);
        // });
        // dataStream.writeData(test);
        dataStream.writeData("Processing");
        const result = streamText({
          model,
          ...(system && { system }),
          messages,
          onFinish: async ({ response }) => {
            // console.log("Response: ", JSON.stringify(response.messages));
            // throw Error("test error");
            dataStream.writeData("Saving to db");
            // update db
            if (id && userId) {
              const isNewChat = await db.chat.findUnique({ where: { id } });
              if (!isNewChat) {
                dataStream.writeData({ newChat: true });
              }
              await updateChat(
                userId,
                id,
                ...appendResponseMessages({
                  messages,
                  responseMessages: response.messages,
                })
              );
            }

            dataStream.writeData("Finished");
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
