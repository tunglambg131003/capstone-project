// env.d.ts
/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_CREDENTIALS_JSON: string;
    OPENAI_API_KEY: string;
    VECTOR_STORE_ID: string;
    GOOGLE_SPREADSHEET_ID: string;
    GOOGLE_SPREADSHEET_RANGE: string;
    GOOGLE_SPREADSHEET_ENDPOINT: string
  }
}
