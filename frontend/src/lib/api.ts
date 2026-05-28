import type { Assignment, QuestionPaper } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }

  return res.json();
}

export const api = {
  getAssignments: () => fetchApi<Assignment[]>("/api/assignments"),

  getAssignment: (id: string) =>
    fetchApi<Assignment & { questionPaper?: QuestionPaper }>(
      `/api/assignments/${id}`
    ),

  createAssignment: (formData: FormData) =>
    fetchApi<Assignment>("/api/assignments", {
      method: "POST",
      body: formData,
    }),

  deleteAssignment: (id: string) =>
    fetchApi<{ success: boolean }>(`/api/assignments/${id}`, {
      method: "DELETE",
    }),

  regenerate: (id: string) =>
    fetchApi<{ jobId: string; status: string }>(
      `/api/assignments/${id}/regenerate`,
      { method: "POST" }
    ),

  getStatus: (id: string) =>
    fetchApi<{ status: string; progress?: number; message?: string }>(
      `/api/assignments/${id}/status`
    ),

  getPdfUrl: (id: string) => `${API_URL}/api/assignments/${id}/pdf`,
};
