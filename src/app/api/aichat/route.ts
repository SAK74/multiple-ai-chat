import { createDataStreamResponse, Message, streamText } from "ai";
import { NextRequest } from "next/server";
import { getModel } from "./getModel";
import { Provider } from "../../types";

export async function POST(request: NextRequest) {
  try {
    // throw Error("New Test error");
    // console.log("cookies: ", request.cookies);

    const {
      messages,
      system,
      provider,
      model: modelId,
      apiKey,
    } = (await request.json()) as {
      messages: Message[];
      system?: string;
      provider?: Provider;
      model?: string;
      apiKey?: string;
    };
    console.log({
      // messages: JSON.stringify(messages),
      system,
      provider,
      modelId,
      apiKey,
    });
    const model = getModel({ provider, modelId, apiKey });

    const dataStreamResponse = createDataStreamResponse({
      execute(dataStream) {
        dataStream.writeData("Initiate");
        const result = streamText({
          model,
          ...(system && { system }),
          messages,
          onFinish: () => {
            // console.log("Finish");
            dataStream.writeData("Finished");
          },
          // onStepFinish: () => {
          //   console.log("Step finished");
          // },
        });
        result.usage.then((usage) => {
          console.log({ usage });
        });
        result.response.then(({ modelId }) => {
          console.log({ modelId });
        });

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

    // const textStream = result.textStream;
    // console.log({ textStream });

    // result.text.then((text) => {
    //   console.log({ text });
    // });

    return dataStreamResponse;
  } catch (error) {
    console.log(error);
    let message = "Unknown error...";
    if (error instanceof Error) {
    }
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
