import portfolio from "@/data/portfolio";
import { Message } from "@/types/qroq";
import Groq from "groq-sdk";

const api = process.env.GROQ_API_KEY!;

if (!api) {
  throw Error("No Groq API Detected Please set it!");
}

const groq = new Groq({
  apiKey: api,
});

// Changed parameter type to accept messages array
async function QAPortfolio(
  messages: Array<{ role: string; content: string }>,
): Promise<ReadableStream> {
  const stream = await groq.chat.completions.create({
    messages: [
      {
        name: "Zenith Assistant",
        role: "system",
        content: portfolio,
      },
      ...(messages as Message[]),
    ],
    temperature: 0.7,
    stream: true,
    top_p: 1,
    max_completion_tokens: 8000,
    model: "llama-3.3-70b-versatile",
  });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const data = `data: ${JSON.stringify({ content })}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return readableStream;
}

export default QAPortfolio;
