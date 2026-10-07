import { api } from "@/api/client";
import { extractList, normalizeWorkspace, toWorkspacePayload } from "@/api/fieldMap";

export const userApi = {
  uploadResume(file, { onProgress, signal } = {}) {
    const form = new FormData();
    form.append("file", file);
    return api.upload("/user/resume/upload", form, { onProgress, signal });
  },
  createWorkspace: (values) => api.post("/user/workspace", toWorkspacePayload(values)).then(normalizeWorkspace),
  listWorkspaces: () => api.get("/user/workspaces").then((p) => extractList(p, ["workspaces"]).map(normalizeWorkspace)),
};
