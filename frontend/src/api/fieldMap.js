// Single source of truth for backend payload shapes. Adjust keys here when the backend contract changes.

const present = (v) => v !== undefined && v !== null && v !== "";
const pick = (obj, keys) => {
  for (const k of keys) if (present(obj?.[k])) return obj[k];
  return undefined;
};

export const unwrap = (payload) => (payload && typeof payload === "object" && "data" in payload ? payload.data : payload);

export function extractList(payload, keys = []) {
  const p = unwrap(payload);
  if (Array.isArray(p)) return p;
  for (const k of [...keys, "items", "results"]) if (Array.isArray(p?.[k])) return p[k];
  return [];
}

export const toSkillList = (v) =>
  Array.isArray(v) ? v.map(String).filter(Boolean) : typeof v === "string" ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];

/* ---------- Interviews ---------- */
export function normalizeInterview(payload) {
  const p = unwrap(payload);
  const r = p?.interview ?? p ?? {};
  return {
    slug: pick(r, ["slug"]),
    title: pick(r, ["title"]),
    description: pick(r, ["description"]),
    skills: toSkillList(pick(r, ["skills"])),
    candidateEmail: pick(r, ["candidateEmail", "candidate_email"]),
    companyName: pick(r, ["companyName", "company_name"]),
    role: pick(r, ["role"]),
    status: pick(r, ["status"]),
    interviewLink: pick(r, ["interviewLink", "interview_link"]),
    createdAt: pick(r, ["createdAt", "created_at"]),
  };
}

export const toInterviewPayload = (v, { includeCandidate }) => ({
  title: v.title.trim(),
  description: v.description.trim(),
  skills: v.skills,
  ...(includeCandidate ? { candidateEmail: v.candidateEmail.trim() } : {}),
  companyName: v.companyName.trim(),
  role: v.role.trim(),
});

// interviewLink may be a token or a full URL; the session route needs the token segment.
export const interviewLinkToken = (link) => (link ? String(link).split("/").filter(Boolean).pop() : undefined);

export const toUserSessionPayload = ({ slug }) => ({ slug });

/* ---------- Workspaces ---------- */
export const normalizeWorkspace = (r) => ({
  id: pick(r, ["id", "_id", "workspaceId", "slug"]),
  name: pick(r, ["name"]),
  createdAt: pick(r, ["createdAt", "created_at"]),
});
export const toWorkspacePayload = ({ name }) => ({ name: name.trim() });

/* ---------- Membership ---------- */
export const toInvitationPayload = ({ email, role }) => ({ email: email.trim(), role });
export const toAcceptInvitationPayload = ({ token }) => ({ token: token.trim() });
export const toMemberRolePayload = ({ email, role }) => ({ email: email.trim(), role });
export const toRemoveMemberPayload = ({ email }) => ({ email: email.trim() });

/* ---------- Resume ---------- */
const HIDDEN_KEY = /(key|secret|token|password|hash)/i;
// Displays only primitive fields that the backend actually returned.
export function resumeResponseFields(payload) {
  const p = unwrap(payload);
  const r = p?.resume ?? p;
  if (!r || typeof r !== "object") return [];
  return Object.entries(r)
    .filter(([k, v]) => ["string", "number", "boolean"].includes(typeof v) && present(v) && !HIDDEN_KEY.test(k))
    .slice(0, 8)
    .map(([k, v]) => ({ key: k, label: k.replace(/[_-]/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2"), value: String(v) }));
}

/* ---------- Video multipart upload ---------- */
export const toUploadStartPayload = ({ file }) => ({ fileName: file.name, contentType: file.type || "video/webm" });
export function normalizeUploadStart(payload) {
  const r = unwrap(payload) ?? {};
  return { uploadId: pick(r, ["uploadId", "upload_id"]), key: pick(r, ["key", "objectKey"]) };
}
export const toSignUrlPayload = ({ uploadId, key, partNumbers }) => ({ uploadId, key, partNumbers });
export function normalizeSignedUrls(payload) {
  const r = unwrap(payload);
  const list = Array.isArray(r) ? r : r?.urls ?? r?.signedUrls ?? r?.parts ?? [];
  return list.map((item, i) =>
    typeof item === "string" ? { partNumber: i + 1, url: item } : { partNumber: item.partNumber ?? item.PartNumber ?? i + 1, url: item.url ?? item.signedUrl },
  );
}
export const toUploadCompletePayload = ({ uploadId, key, parts }) => ({ uploadId, key, parts });
