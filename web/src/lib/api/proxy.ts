import { appConfig } from "@/lib/config";
import { getAuthToken } from "@/lib/auth/session";

export async function proxyBackendRequest(
  request: Request,
  path: string[],
  withAuth = true,
) {
  const url = new URL(path.join("/"), `${appConfig.apiBaseUrl}/`);
  const requestUrl = new URL(request.url);
  url.search = requestUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");

  if (withAuth) {
    const token = await getAuthToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
  }

  const method = request.method.toUpperCase();
  const response = await fetch(url, {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : await request.text(),
    cache: "no-store",
  });

  const text = await response.text();

  return new Response(text, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
