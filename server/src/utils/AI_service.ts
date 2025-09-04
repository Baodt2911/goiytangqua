import dotenv from "dotenv";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { Message } from "src/types";

dotenv.config();
const openaiKey = process.env.OPENAI_API_KEY || "123";
const claudeKey = process.env.CLAUDE_API_KEY || "123";
const geminiKey = process.env.GEMINI_API_KEY;
if (!openaiKey) throw new Error("OPENAI_API_KEY chưa được cấu hình");
if (!claudeKey) throw new Error("CLAUDE_API_KEY chưa được cấu hình");
if (!geminiKey) throw new Error("GEMINI_API_KEY chưa được cấu hình");

const openai = new OpenAI({ apiKey: openaiKey });
const anthropic = new Anthropic({ apiKey: claudeKey });
const genAI = new GoogleGenAI({ apiKey: geminiKey });

export type AIPrompt = {
  aiProvider: "openai" | "claude" | "gemini";
  aiModel: string;
  temperature?: number;
  maxTokens?: number;
  systemMessage?: string;
  history?: Message[];
  stream?: boolean;
};

/**
 * Chuẩn hóa tất cả providers về ReadableStream<Uint8Array>
 */
function toReadableStreamFromAsyncIterator(
  asyncIterable: AsyncIterable<any>,
  extractor: (chunk: any) => string | undefined
): ReadableStream<Uint8Array> {
  const iterator = asyncIterable[Symbol.asyncIterator]();

  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
        return;
      }

      const text = extractor(value);
      if (text) {
        controller.enqueue(new TextEncoder().encode(text));
      }
    },
    async cancel() {
      await iterator.return?.();
    },
  });
}

export async function callAIWithPrompt(prompt: AIPrompt, finalPrompt: string) {
  const systemMsg = prompt.systemMessage || "Bạn là trợ lý AI thông minh.";
  const temperature = prompt.temperature ?? 0.7;
  const maxTokens = prompt.maxTokens ?? 1024;
  const history = prompt.history || [];
  const stream = prompt.stream || false;
  console.log({
    text:
      systemMsg +
      "\n\n" +
      history.map((h) => `${h.role.toUpperCase()}: ${h.content}`).join("\n") +
      "\nUSER: " +
      finalPrompt,
  });

  switch (prompt.aiProvider) {
    case "openai": {
      if (stream) {
        const res = await openai.chat.completions.create({
          model: prompt.aiModel,
          temperature,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: systemMsg },
            ...history,
            { role: "user", content: finalPrompt },
          ],
          stream: true,
        });
        // OpenAI đã có sẵn toReadableStream()
        return res.toReadableStream();
      } else {
        const res = await openai.chat.completions.create({
          model: prompt.aiModel,
          temperature,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: systemMsg },
            ...history,
            { role: "user", content: finalPrompt },
          ],
        });
        return res.choices[0].message.content;
      }
    }

    case "claude": {
      if (stream) {
        const res = await anthropic.messages.create({
          model: prompt.aiModel,
          temperature,
          max_tokens: maxTokens,
          system: systemMsg,
          messages: [
            ...history.map((h) => ({ role: h.role, content: h.content })),
            { role: "user", content: finalPrompt },
          ],
          stream: true,
        });

        // Chuẩn hóa AsyncIterator -> ReadableStream
        return toReadableStreamFromAsyncIterator(res, (chunk) => {
          if (chunk.type === "content_block_delta") {
            return chunk.delta?.text ?? "";
          }
          return "";
        });
      } else {
        const res = await anthropic.messages.create({
          model: prompt.aiModel,
          temperature,
          max_tokens: maxTokens,
          system: systemMsg,
          messages: [
            ...history.map((h) => ({ role: h.role, content: h.content })),
            { role: "user", content: finalPrompt },
          ],
        });
        return res.content;
      }
    }

    case "gemini": {
      if (stream) {
        const res = await genAI.models.generateContentStream({
          model: prompt.aiModel,
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    systemMsg +
                    "\n\n" +
                    history
                      .map((h) => `${h.role.toUpperCase()}: ${h.content}`)
                      .join("\n") +
                    "\nUSER: " +
                    finalPrompt,
                },
              ],
            },
          ],
          config: {
            temperature,
            maxOutputTokens: maxTokens,
          },
        });

        return toReadableStreamFromAsyncIterator(res, (chunk) => {
          return chunk.text ?? "";
        });
      } else {
        const res = await genAI.models.generateContent({
          model: prompt.aiModel,
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    systemMsg +
                    "\n\n" +
                    history
                      .map((h) => `${h.role.toUpperCase()}: ${h.content}`)
                      .join("\n") +
                    "\nUSER: " +
                    finalPrompt,
                },
              ],
            },
          ],
          config: {
            temperature,
            maxOutputTokens: maxTokens,
          },
        });
        return res.text;
      }
    }

    default:
      throw new Error("AI Provider không được hỗ trợ.");
  }
}
