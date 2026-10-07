// UI-only gating. The backend enforces authorization on every request.
export const ROLES = ["ADMIN", "HR", "VIEWER"];

const ORG_PERMISSIONS = {
  viewInterviews: ["ADMIN", "HR", "VIEWER"],
  createInterview: ["ADMIN", "HR"],
  openInterviewRoom: ["ADMIN", "HR"],
  viewWorkspaces: ["ADMIN", "HR"],
  createWorkspace: ["ADMIN"],
  inviteMembers: ["ADMIN"],
  manageRoles: ["ADMIN"],
};

export const ROLE_SUMMARY = {
  ADMIN: "Full access: workspaces, invitations, member roles and interviews.",
  HR: "Create and run interviews, view candidates and workspaces.",
  VIEWER: "Read-only access to interviews and candidate information.",
};

export function can(scope, role, action) {
  if (scope === "personal") return true;
  return ORG_PERMISSIONS[action]?.includes(role) ?? false;
}

export const PERMISSION_MATRIX = [
  { label: "View interviews & candidates", action: "viewInterviews" },
  { label: "Create interviews", action: "createInterview" },
  { label: "View workspaces", action: "viewWorkspaces" },
  { label: "Create workspaces", action: "createWorkspace" },
  { label: "Invite members", action: "inviteMembers" },
  { label: "Change or remove member roles", action: "manageRoles" },
];
