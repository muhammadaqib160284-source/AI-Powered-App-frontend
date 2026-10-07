// Tenant ID is part of every org key so switching context never shows another tenant's cache.
export const qk = {
  interviews: (scope, tenantId) => ["interviews", scope, tenantId ?? "me"],
  interview: (scope, tenantId, slug) => ["interview", scope, tenantId ?? "me", slug],
  workspaces: (scope, tenantId) => ["workspaces", scope, tenantId ?? "me"],
};
