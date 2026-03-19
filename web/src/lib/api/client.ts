type ClientFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Record<string, string | number | undefined>;
};

export async function clientApiFetch<T>(
  path: string,
  options: ClientFetchOptions = {},
): Promise<T> {
  const url = new URL(path.replace(/^\//, ""), `${window.location.origin}/api/proxy/`);

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
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
