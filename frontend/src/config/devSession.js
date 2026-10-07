// DEV ONLY: replace with data from POST /login and POST /refresh once auth is integrated.
// Roles here only drive UI visibility; the backend remains the source of truth for authorization.
export const DEV_SESSION = {
  accessToken: "dev-access-token-replace-me",
  user: { name: "Jordan Lee", email: "jordan.lee@example.com" },
  memberships: [
    { tenantId: "tenant_acme", name: "Acme Inc.", role: "ADMIN" },
    { tenantId: "tenant_startup_xyz", name: "Startup XYZ", role: "HR" },
    { tenantId: "tenant_company_abc", name: "Company ABC", role: "VIEWER" },
  ],
};
