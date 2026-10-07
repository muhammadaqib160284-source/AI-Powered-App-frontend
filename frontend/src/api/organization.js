import { api } from "@/api/client";
import {
  extractList,
  normalizeWorkspace,
  toAcceptInvitationPayload,
  toInvitationPayload,
  toMemberRolePayload,
  toRemoveMemberPayload,
  toWorkspacePayload,
} from "@/api/fieldMap";

export const organizationApi = {
  createWorkspace: (values) => api.post("/organization/workspace", toWorkspacePayload(values)).then(normalizeWorkspace),
  listWorkspaces: () =>
    api.get("/organization/workspaces").then((p) => extractList(p, ["workspaces"]).map(normalizeWorkspace)),
  invite: (values) => api.post("/organization/invitation", toInvitationPayload(values)),
  // The invitee is not yet a member, so no tenant header is attached; the token identifies the organization.
  acceptInvitation: (values) =>
    api.post("/organization/invitation/accept", toAcceptInvitationPayload(values), { skipTenant: true }),
  updateMemberRole: (values) => api.put("/organization/member/role", toMemberRolePayload(values)),
  removeMember: (values) => api.delete("/organization/member/role", toRemoveMemberPayload(values)),
};
