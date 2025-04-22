// import { z } from 'zod';
// import OpenAI from 'openai';

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// export const fileSearchTool = {
//   description: 'Search and retrieve answers from files based on user queries using vector search.',
//   parameters: z.object({
//     query: z.string().describe('The search query to find relevant answers from files.'),
//   }),
//   generate: async function* ({ query }: { query: string }) {
//     const data = await fetchFileSearchResults(query);
//     yield data;
//   },
// };

// const fetchFileSearchResults = async (query: string) => {
//   const response = await openai.responses.create({
//     model: 'gpt-4o-mini',
//     input: query,
//     tools: [
//       {
//         type: 'file_search',
//         vector_store_ids: ["vs_67f734ff7a10819195491f92be6adc4d"], // Replace with your vector store ID
//       },
//     ],
//   });

//   return response; // Returning full response object (includes .data)
// };

import OpenAI from "openai";
import { tool } from 'ai';
import { z } from 'zod';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const fetchFileSearch = async ({ query, vectorStoreId }: { query: string; vectorStoreId: string }) => {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: query,
    tools: [{
      type: "file_search",
      vector_store_ids: [vectorStoreId],
    }],
  });

  return response.output_text; 
};

export const fileSearchTool = tool({
  description: 'Search and retrieve answers from files based on user queries using vector search.',
  parameters: z.object({
    query: z.string().describe('The search query to find relevant answers from files.')
  }),
  execute: async ({ query }) => {
    const results = await fetchFileSearch({ query, vectorStoreId: "vs_67f734ff7a10819195491f92be6adc4d" });

    console.log(results)

    return results
  },
});


