const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

function requireAppsScriptUrl() {
  if (!APPS_SCRIPT_URL) {
    throw new Error("Set APPS_SCRIPT_URL before running this script.");
  }

  return APPS_SCRIPT_URL;
}

async function parseResponse(response) {
  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Apps Script returned an invalid response: ${text.slice(0, 200)}`);
  }

  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || "Google Apps Script request failed");
  }

  return data;
}

async function appsScriptGet(params) {
  const url = new URL(requireAppsScriptUrl());
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return parseResponse(await fetch(url, { cache: "no-store" }));
}

async function appsScriptPost(payload) {
  return parseResponse(await fetch(requireAppsScriptUrl(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    cache: "no-store",
  }));
}

module.exports = { appsScriptGet, appsScriptPost };
