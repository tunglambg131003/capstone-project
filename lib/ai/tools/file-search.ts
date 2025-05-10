import OpenAI from "openai";
import { tool } from 'ai';
import { z } from 'zod';
import { fileSearchPromptInstruction } from '@/lib/ai/prompts';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const fetchFileSearch = async ({ query, vectorStoreId }: { query: string; vectorStoreId: string }) => {
  const formattedQuery = `${query}\n\n${fileSearchPromptInstruction}`;

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: formattedQuery,
    tools: [{
      type: "file_search",
      vector_store_ids: [vectorStoreId],
    }],
  });

  const textAnswer = response.output_text;

  if (textAnswer === "DENIED") {
    return "I'm sorry, but I can only assist with questions related to VinUni or university-related topics."
  }

  if (textAnswer === "NOT_FOUND") {

    const webResponse = await openai.responses.create({
      model: "gpt-4.1",
      input: formattedQuery,
      tools: [{ type: "web_search_preview" }]
    });

    return webResponse.output_text;
  }

  return textAnswer;
};

export const fileSearchTool = tool({
  description: `Search and retrieve answers from files based on user queries using vector search.`,
  parameters: z.object({
    query: z.string().describe('The search query to find relevant answers from files.')
  }),
  execute: async ({ query }) => {
    const results = await fetchFileSearch({ query, vectorStoreId: process.env.VECTOR_STORE_ID! });

    return results
  },
});
