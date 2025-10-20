import QAPortfolio from "@/lib/groq";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { messages } = await req.json();

    // Get the ReadableStream from QAPortfolio
    const stream = await QAPortfolio(messages);

    // Return the stream
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
