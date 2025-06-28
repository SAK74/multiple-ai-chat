import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // console.log("cookies: ", request.cookies);

    const { messages, system } = await request.json();
    console.log({ messages: JSON.stringify(messages), system });

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      ...(system && { system }),
      messages,
      // onFinish: () => {
      //   console.log("Finish");
      // },
      // onStepFinish: () => {
      //   console.log("Step finished");
      // },
    });
    result.steps.then((steps) => {
      console.log({ steps });
    });

    // const textStream = result.textStream;
    // console.log({ textStream });

    // result.text.then((text) => {
    //   console.log({ text });
    // });
    result.usage.then((usage) => {
      console.log({ usage });
    });

    return result.toDataStreamResponse({ sendUsage: true });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
