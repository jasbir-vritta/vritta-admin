// Backend base URL, e.g. https://feature-backend-…run.app (no trailing slash).
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  { token, method = "GET", body }: { token?: string | null; method?: string; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(API_URL + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // FastAPI: detail is a string, or a list of validation errors.
    const detail = data?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail) && detail[0]?.msg
          ? String(detail[0].msg).replace(/^Value error, /, "")
          : "Something went wrong. Please try again.";

    throw new ApiError(message, response.status);
  }

  return data as T;
}
