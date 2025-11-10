export const API_BASE = "http://localhost:3001";

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Request failed");
  }
  return res.json();
}

export async function get(url) {
  const res = await fetch(`${API_BASE}${url}`);
  return handleResponse(res);
}

export async function post(url, body = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}
