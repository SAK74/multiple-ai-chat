import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const chunksLenght = 10;
    let timeout: NodeJS.Timeout;
    const stream = new ReadableStream({
      start(controller) {
        for (let i = 1; i <= chunksLenght; i += 1) {
          timeout = setTimeout(() => {
            controller.enqueue(
              new TextEncoder().encode(`The ${i} exampled message`)
            );
            if (i === chunksLenght) {
              controller.close();
            }
          }, i * 600);
        }
      },
      cancel(reason) {
        console.log("Stream was canceled: ", reason);
        timeout.close();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      // status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
