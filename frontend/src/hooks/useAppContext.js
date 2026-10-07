import { useOutletContext } from "react-router-dom";
import { can } from "@/lib/permissions";

// Provided by PersonalLayout / OrgLayout: { scope, tenantId, role, basePath, contextName }
export function useAppContext() {
  const ctx = useOutletContext();
  return { ...ctx, can: (action) => can(ctx.scope, ctx.role, action) };
}
