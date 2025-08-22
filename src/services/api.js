// Tiny helper around fetch for JSON APIs

export const BASE_URL = "http://localhost:3001";

// Helper for JSON requests (POST/PATCH/PUT)
export async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error("Network error");
  return res.json();
}