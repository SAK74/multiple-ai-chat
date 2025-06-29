import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
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

    const result = streamText({
      model,
      ...(system && { system }),
      messages,
      // onFinish: () => {
      //   console.log("Finish");
      // },
      // onStepFinish: () => {
      //   console.log("Step finished");
      // },
    });

    // const textStream = result.textStream;
    // console.log({ textStream });

    // result.text.then((text) => {
    //   console.log({ text });
    // });
    result.usage.then((usage) => {
      console.log({ usage });
    });
    result.response.then(({ modelId }) => {
      console.log({ modelId });
    });

    return result.toDataStreamResponse({ sendUsage: true });
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
