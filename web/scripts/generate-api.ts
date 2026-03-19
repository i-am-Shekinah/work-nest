import "dotenv/config";

import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import openapiTS, { astToString } from "openapi-typescript";

const swaggerDocsUrl = process.env.NEXT_PUBLIC_SWAGGER_DOCS_URL;

if (!swaggerDocsUrl) {
  throw new Error("NEXT_PUBLIC_SWAGGER_DOCS_URL is required for API generation.");
}

const swaggerJsonUrl = swaggerDocsUrl.endsWith("-json")
  ? swaggerDocsUrl
  : `${swaggerDocsUrl.replace(/\/$/, "")}-json`;

const outputPath = join(process.cwd(), "src/lib/api/generated/openapi.ts");

async function main() {
  const types = await openapiTS(swaggerJsonUrl);
  await writeFile(outputPath, typesToString(astToString(types)), "utf8");
  console.log(`OpenAPI types generated from ${swaggerJsonUrl}`);
}

function typesToString(contents: string) {
  return `/* eslint-disable */\n${contents}`;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
