const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz5OvT2U8Z3f7wXNLM4t5jSLcsI-fiEob7xYLlBG4Zl6PSpRfoB6OGdT8329rrDDGC6bA/exec";

type AppsScriptResponse = {
  success?: boolean;
  error?: string;
  [key: string]: unknown;
};

export async function appsScriptPost<T = unknown>(
  payload: Record<string, unknown>
): Promise<T> {
  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();

  let data: AppsScriptResponse;

  try {
    data = JSON.parse(text) as AppsScriptResponse;
  } catch {
    data = {
      success: response.ok,
      raw: text,
    };
  }

  if (!response.ok || data?.success === false) {
    throw new Error(
      data?.error || "Google Apps Script request failed"
    );
  }

  return data as T;
}

export async function appsScriptGet<T = unknown>(
  params: Record<string, string>
): Promise<T> {
  const url = new URL(APPS_SCRIPT_URL);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  const text = await response.text();

  let data: AppsScriptResponse;

  try {
    data = JSON.parse(text) as AppsScriptResponse;
  } catch {
    data = {
      success: response.ok,
      raw: text,
    };
  }

  if (!response.ok || data?.success === false) {
    throw new Error(
      data?.error || "Google Apps Script request failed"
    );
  }

  return data as T;
}