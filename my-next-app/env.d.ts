// Generated by Wrangler
// by running `wrangler types --env-interface CloudflareEnv env.d.ts`

interface CloudflareEnv {
  CLOUDFLARE_ACCOUNT_ID: string;
  AUTORAG_NAME: string;
  AUTORAG_API_TOKEN: string;
}

// Add type definitions for process.env
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_CLOUDFLARE_CLIENT_ID: string;
    NEXT_PUBLIC_APP_URL: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    AUTORAG_NAME: string;
    AUTORAG_API_TOKEN: string;
  }
}
