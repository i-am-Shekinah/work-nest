import { appConfig } from "@/lib/config";
import { getAuthToken } from "@/lib/auth/session";

type ServerFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  searchParams?: URLSearchParams | Record<string, string | number | undefined>;
};

export async function serverApiFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const token = await getAuthToken();
  const url = new URL(path.replace(/^\//, ""), `${appConfig.apiBaseUrl}/`);

  if (options.searchParams) {
    const entries =
      options.searchParams instanceof URLSearchParams
        ? options.searchParams.entries()
        : Object.entries(options.searchParams).map(([key, value]) => [
            key,
            value === undefined ? "" : String(value),
          ]);

    for (const [key, value] of entries) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }
  }

  const response = await fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const payload = await safeJson(response);
    throw new Error(
      payload?.message ?? `Request failed with status ${response.status}`,
    );
  }

  return (await safeJson(response)) as T;
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
