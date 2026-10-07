import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { Boxes, FileText, LayoutDashboard, MailOpen, MessagesSquare, PlusCircle, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import { sessionStore, useSession } from "@/lib/session";
import { can } from "@/lib/permissions";

function ShellLoading() {
  return (
    <div className="space-y-4 p-10" data-testid="context-loading">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

export function PersonalLayout() {
  const { activeContext } = useSession();
  useEffect(() => sessionStore.setActiveContext({ type: "personal" }), []);
  const base = "/app/personal";
  const nav = [
    { id: "overview", label: "Overview", to: base, end: true, icon: LayoutDashboard },
    { id: "interviews", label: "Interviews", to: `${base}/interviews`, icon: MessagesSquare },
    { id: "new-interview", label: "New interview", to: `${base}/interviews/new`, icon: PlusCircle },
    { id: "resume", label: "Resume", to: `${base}/resume`, icon: FileText },
    { id: "workspaces", label: "Workspaces", to: `${base}/workspaces`, icon: Boxes },
    { id: "invitations", label: "Invitations", to: `${base}/invitations`, icon: MailOpen },
  ];
  const ready = activeContext.type === "personal";
  return (
    <AppShell nav={nav} contextName="Individual">
      {ready ? <Outlet context={{ scope: "personal", tenantId: null, role: null, basePath: base, contextName: "Individual" }} /> : <ShellLoading />}
    </AppShell>
  );
}

export function OrgLayout() {
  const { orgId } = useParams();
  const { memberships, activeContext } = useSession();
  const membership = memberships.find((m) => m.tenantId === orgId);

  useEffect(() => {
    if (membership) sessionStore.setActiveContext({ type: "organization", tenantId: orgId });
  }, [orgId, membership]);

  if (!membership) return <Navigate to="/app/personal" replace />;

  const { role, name } = membership;
  const base = `/app/org/${orgId}`;
  const nav = [
    { id: "overview", label: "Overview", to: base, end: true, icon: LayoutDashboard },
    { id: "interviews", label: "Interviews", to: `${base}/interviews`, icon: MessagesSquare },
    can("organization", role, "createInterview") && { id: "new-interview", label: "New interview", to: `${base}/interviews/new`, icon: PlusCircle },
    can("organization", role, "viewWorkspaces") && { id: "workspaces", label: "Workspaces", to: `${base}/workspaces`, icon: Boxes },
    can("organization", role, "manageRoles") && { id: "team", label: "Team & access", to: `${base}/team`, icon: Users },
  ].filter(Boolean);

  const ready = activeContext.type === "organization" && activeContext.tenantId === orgId;
  return (
    <AppShell nav={nav} contextName={name} role={role}>
      {ready ? (
        <Outlet key={orgId} context={{ scope: "organization", tenantId: orgId, role, basePath: base, contextName: name }} />
      ) : (
        <ShellLoading />
      )}
    </AppShell>
  );
}

export function AppEntry() {
  const { activeContext, memberships } = useSession();
  const org = activeContext.type === "organization" && memberships.find((m) => m.tenantId === activeContext.tenantId);
  return <Navigate to={org ? `/app/org/${org.tenantId}` : "/app/personal"} replace />;
}
