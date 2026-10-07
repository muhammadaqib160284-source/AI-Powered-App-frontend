import { api } from "@/api/client";

export const uploadsApi = {
  start: (payload) => api.post("/interview/upload/start", payload),
  signUrls: (payload) => api.post("/interview/video/sign-url", payload),
  complete: (payload) => api.post("/interview/upload/complete", payload),
};
