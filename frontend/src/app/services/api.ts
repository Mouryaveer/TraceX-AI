const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export interface SearchResult {
  similarity_score: number;
  similarity_pct: number;
  status: "High Risk Piracy" | "Possible Copy" | "Safe";
  platform: string;
  url: string;
  title: string;
  legal_advice: {
    risk_level: string;
    confidence_pct: number;
    actions: string[];
  };
}

export interface SearchResponse {
  query_video: string;
  total_scanned: number;
  matches_found: number;
  piracy_detected: boolean;
  results: SearchResult[];
}

export async function searchVideo(file: File): Promise<SearchResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000); // 2 min timeout

  try {
    const response = await fetch(`${BASE_URL}/search`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: "Server Error" }));
      throw new Error(err.detail || `Server responded with ${response.status}`);
    }

    return (await response.json()) as SearchResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out. The server is taking too long.");
    }
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Server not reachable. Make sure the backend is running on http://127.0.0.1:8000");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function uploadMedia(file: File): Promise<{ message: string; filename: string; media_id: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }

  return response.json();
}

export function checkHealth(): Promise<boolean> {
  return fetch(`${BASE_URL}/`, { method: "GET" })
    .then((r) => r.ok)
    .catch(() => false);
}
