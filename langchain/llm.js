import { ChatOpenAI } from "@langchain/openai";

export const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
});