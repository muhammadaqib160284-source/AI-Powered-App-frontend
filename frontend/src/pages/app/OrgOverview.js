import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Boxes, Eye, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, PageHeader, Panel } from "@/components/common/Page";
import { RoleBadge } from "@/components/common/Badges";
import { RecentInterviews, StatCard, StatusBreakdown } from "@/components/dashboard/DashboardWidgets";
import { interviewsApi } from "@/api/interviews";
import { organizationApi } from "@/api/organization";
import { qk } from "@/lib/queryKeys";
import { ROLE_SUMMARY } from "@/lib/permissions";
import { useAppContext } from "@/hooks/useAppContext";

function QuickAction({ to, icon: Icon, label, testId }) {
  return (
    <Link to={to} data-testid={testId} className="group flex items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors hover:bg-accent/40">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1">{label}</span>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export default function OrgOverview() {
  const { tenantId, basePath, role, contextName, can } = useAppContext();
  const interviews = useQuery({ queryKey: qk.interviews("organization", tenantId), queryFn: () => interviewsApi("organization").list() });
  const workspaces = useQuery({ queryKey: qk.workspaces("organization", tenantId), queryFn: organizationApi.listWorkspaces, enabled: can("viewWorkspaces") });
  const candidates = interviews.data && new Set(interviews.data.map((i) => i.candidateEmail).filter(Boolean)).size;
  const completed = interviews.data?.filter((i) => /complete/i.test(i.status ?? "")).length;

  return (
    <Page className="space-y-8">
      <PageHeader eyebrow="Organization" title={contextName} description="Interview activity across your organization."
        actions={can("createInterview") && <Button asChild size="sm" data-testid="overview-new-interview-button"><Link to={`${basePath}/interviews/new`}><Plus /> New interview</Link></Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Interviews" value={interviews.data?.length} loading={interviews.isLoading} testId="stat-interviews" />
        <StatCard label="Candidates" value={candidates} loading={interviews.isLoading} hint="Unique candidate emails" testId="stat-candidates" />
        <StatCard label="Completed" value={completed} loading={interviews.isLoading} testId="stat-completed" />
        {can("viewWorkspaces") ? <StatCard label="Workspaces" value={workspaces.data?.length} loading={workspaces.isLoading} testId="stat-workspaces" />
          : <StatCard label="Your access" value={role} hint="Read-only" testId="stat-access" />}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Recent interviews" actions={<Link to={`${basePath}/interviews`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground" data-testid="overview-view-all-interviews">View all <ArrowRight className="h-3 w-3" /></Link>}>
          <RecentInterviews query={interviews} basePath={basePath} showCandidate
            emptyAction={can("createInterview") && <Button asChild size="sm" variant="outline"><Link to={`${basePath}/interviews/new`}><Plus /> New interview</Link></Button>} />
        </Panel>
        <div className="space-y-6">
          <Panel title="Your role" testId="overview-role-panel">
            <RoleBadge role={role} />
            <p className="mt-2 text-sm text-muted-foreground">{ROLE_SUMMARY[role]}</p>
          </Panel>
          <Panel title="By status">{interviews.isSuccess ? <StatusBreakdown items={interviews.data} /> : <p className="text-sm text-muted-foreground">—</p>}</Panel>
          <div className="space-y-2">
            <QuickAction to={`${basePath}/interviews`} icon={Eye} label="Review interviews" testId="quick-review-interviews" />
            {can("viewWorkspaces") && <QuickAction to={`${basePath}/workspaces`} icon={Boxes} label="Workspaces" testId="quick-workspaces" />}
            {can("manageRoles") && <QuickAction to={`${basePath}/team`} icon={Users} label="Invite & manage members" testId="quick-team" />}
          </div>
        </div>
      </div>
    </Page>
  );
}
