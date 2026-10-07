import { api } from "@/api/client";
import { extractList, normalizeInterview, toInterviewPayload, toUserSessionPayload } from "@/api/fieldMap";

const BASE = { personal: "/user", organization: "/organization" };

export function interviewsApi(scope) {
  const base = BASE[scope];
  return {
    list: () => api.get(`${base}/interviews`).then((p) => extractList(p, ["interviews"]).map(normalizeInterview)),
    get: (slug) => api.get(`${base}/interview/${encodeURIComponent(slug)}`).then(normalizeInterview),
    create: (values) =>
      api.post(`${base}/interview`, toInterviewPayload(values, { includeCandidate: scope === "organization" })).then(normalizeInterview),
    // personal: id = slug; organization: id = interviewLink token
    startSession: (id) =>
      scope === "organization"
        ? api.post(`/organization/interview/session/${encodeURIComponent(id)}`)
        : api.post("/user/interview/session", toUserSessionPayload({ slug: id })),
    sendMessage: (payload) => api.post(`${base}/interview/message`, payload),
  };
}
