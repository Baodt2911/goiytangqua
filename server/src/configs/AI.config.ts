import { GoogleGenerativeAI } from "@google/generative-ai";
const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey) {
  throw new Error("GEMINI_API_KEY chưa được cấu hình");
}
const genAI = new GoogleGenerativeAI(geminiKey);
export const modelGemini = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
