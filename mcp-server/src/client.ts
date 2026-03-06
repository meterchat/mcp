const DEFAULT_BASE_URL = "https://api.meter.chat";

export interface MeterClientConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface MeterError {
  error: string;
  message: string;
}

export function createClient(config: MeterClientConfig) {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;

  async function request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${baseUrl}${path}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "meter-chat-mcp-server/0.1.0",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text();
      let message: string;
      try {
        const parsed = JSON.parse(text) as MeterError;
        message = parsed.message || parsed.error || text;
      } catch {
        message = text;
      }

      if (response.status === 401) {
        throw new Error(
          `Invalid API key. Check your METER_API_KEY environment variable. (${message})`
        );
      }
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        throw new Error(
          `Rate limited. ${retryAfter ? `Retry after ${retryAfter}s.` : "Try again shortly."}`
        );
      }
      throw new Error(`Meter API error (${response.status}): ${message}`);
    }

    return response.json() as Promise<T>;
  }

  return {
    get: <T>(path: string) => request<T>("GET", path),
    post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
    put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
    patch: <T>(path: string, body?: unknown) =>
      request<T>("PATCH", path, body),
  };
}

export type MeterClient = ReturnType<typeof createClient>;
