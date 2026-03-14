export async function apiClient<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload as T;
}
