/**
 * WolframAlpha API Query Helper
 *
 * Usage:
 *   WOLFRAM_ALPHA_APP_ID=xxx npx ts-node scripts/wolfram-query.ts "solve kuramoto model"
 *
 * This script sends a query to the WolframAlpha Short Answers API and prints
 * the result. It is deterministic and read-only (no state mutation).
 */

interface WolframResponse {
  ok: boolean;
  result?: string;
  error?: string;
}

function getAppId(): string {
  const id = process.env.WOLFRAM_ALPHA_APP_ID;
  if (!id) {
    throw new Error(
      "WOLFRAM_ALPHA_APP_ID is not set. Copy .env.example to .env and fill in your key."
    );
  }
  return id;
}

export async function queryWolfram(input: string): Promise<WolframResponse> {
  const appId = getAppId();
  const encoded = encodeURIComponent(input);
  const url = `https://api.wolframalpha.com/v1/result?appid=${appId}&i=${encoded}`;

  const response = await fetch(url);
  const text = await response.text();

  if (!response.ok) {
    return { ok: false, error: `HTTP ${response.status}: ${text}` };
  }

  return { ok: true, result: text };
}

async function main(): Promise<void> {
  const query = process.argv[2];
  if (!query) {
    console.error("Usage: ts-node scripts/wolfram-query.ts <query>");
    process.exit(1);
  }

  const result = await queryWolfram(query);
  if (result.ok) {
    console.log(result.result);
  } else {
    console.error(result.error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
