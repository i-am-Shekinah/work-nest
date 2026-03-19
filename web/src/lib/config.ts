const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const swaggerDocsUrl = process.env.NEXT_PUBLIC_SWAGGER_DOCS_URL;

if (!apiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined.");
}

if (!swaggerDocsUrl) {
  throw new Error("NEXT_PUBLIC_SWAGGER_DOCS_URL is not defined.");
}

export const appConfig = {
  apiBaseUrl,
  swaggerDocsUrl,
  sessionCookieName: "worknest_session",
};

export function getSwaggerJsonUrl() {
  const docsUrl = appConfig.swaggerDocsUrl;

  if (docsUrl.endsWith("-json")) {
    return docsUrl;
  }

  return docsUrl.endsWith("/api/docs")
    ? `${docsUrl}-json`
    : `${docsUrl.replace(/\/$/, "")}-json`;
}
