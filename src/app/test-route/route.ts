import { createDataStream, createDataStreamResponse, streamText } from "ai";
import { NextRequest } from "next/server";
import { getModel } from "./getModel";

export async function POST(request: NextRequest) {
  try {
    // throw Error("New Test error");
    // console.log("cookies: ", request.cookies);

    const { messages, system, provider, model: modelId } = await request.json();
    console.log({
      // messages: JSON.stringify(messages),
      system,
      provider,
      modelId,
    });
    const model = getModel(provider, modelId);
    // check limit for current IP (if overdraften: break)

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
    });

    // const textStream = result.textStream;
    // console.log({ textStream });

    // result.text.then((text) => {
    //   console.log({ text });
    // });

    const data = createDataStream({
      execute(dataStream) {
        dataStream.writeData({ myData: "Example" });
      },
    });

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
