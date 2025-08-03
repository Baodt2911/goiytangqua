import dotenv from "dotenv";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const openaiKey = process.env.OPENAI_API_KEY || "123";
const claudeKey = process.env.CLAUDE_API_KEY || "123";
const geminiKey = process.env.GEMINI_API_KEY;
if (!openaiKey) {
  throw new Error("OPENAI_API_KEY chưa được cấu hình");
}

if (!claudeKey) {
  throw new Error("CLAUDE_API_KEY chưa được cấu hình");
}

if (!geminiKey) {
  throw new Error("GEMINI_API_KEY chưa được cấu hình");
}

const openai = new OpenAI({
  apiKey: openaiKey,
});

const anthropic = new Anthropic({
  apiKey: claudeKey,
});

const genAI = new GoogleGenAI({ apiKey: geminiKey });

export type AIPrompt = {
  aiProvider: "openai" | "claude" | "gemini";
  aiModel: string;
  temperature?: number;
  maxTokens?: number;
  systemMessage?: string;
};

export async function callAIWithPrompt(prompt: AIPrompt, finalPrompt: string) {
  const systemMsg = prompt.systemMessage || "Bạn là trợ lý AI thông minh.";
  const temperature = prompt.temperature ?? 0.7;
  const maxTokens = prompt.maxTokens ?? 1024;
  switch (prompt.aiProvider) {
    case "openai": {
      const response = await openai.chat.completions.create({
        model: prompt.aiModel,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: finalPrompt },
        ],
      });
      return response.choices[0].message.content;
    }

    case "claude": {
      const response = await anthropic.messages.create({
        model: prompt.aiModel,
        temperature,
        max_tokens: maxTokens,
        system: systemMsg,
        messages: [
          {
            role: "user",
            content: finalPrompt,
          },
        ],
      });
      return response.content;
    }

    case "gemini": {
      const response = await genAI.models.generateContent({
        model: prompt.aiModel,
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemMsg}\n\n${finalPrompt}` }],
          },
        ],
        config: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      });
      return response.text;
    }

    default:
      throw new Error("AI Provider không được hỗ trợ.");
  }
}
