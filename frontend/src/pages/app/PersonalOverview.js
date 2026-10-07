import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FileText, MessagesSquare, PlayCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, PageHeader, Panel } from "@/components/common/Page";
import { RecentInterviews, StatCard, StatusBreakdown } from "@/components/dashboard/DashboardWidgets";
import { interviewsApi } from "@/api/interviews";
import { userApi } from "@/api/user";
import { qk } from "@/lib/queryKeys";
import { useSession } from "@/lib/session";
import { useAppContext } from "@/hooks/useAppContext";

function NextStep({ interviews, basePath }) {
  const first = interviews?.[0];
  const step = !interviews?.length
    ? { title: "Create your first practice interview", body: "Pick a role you're preparing for and the skills you want to be tested on.", to: `${basePath}/interviews/new`, cta: "New interview", icon: Plus }
    : { title: `Continue with "${first.title ?? "your latest interview"}"`, body: "Open the interview to review its details and start when you're ready.", to: `${basePath}/interviews${first.slug ? `?i=${encodeURIComponent(first.slug)}` : ""}`, cta: "Open interview", icon: PlayCircle };
  return (
    <div className="fade-up flex flex-col gap-4 rounded-lg border bg-card p-6 sm:flex-row sm:items-center sm:justify-between" data-testid="next-step-card">
      <div>
        <p className="eyebrow mb-2 text-primary">Next step</p>
        <p className="font-medium">{step.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
      </div>
      <Button asChild data-testid="next-step-cta"><Link to={step.to}><step.icon /> {step.cta}</Link></Button>
    </div>
  );
}

export default function PersonalOverview() {
  const { user } = useSession();
  const { basePath } = useAppContext();
  const interviews = useQuery({ queryKey: qk.interviews("personal"), queryFn: () => interviewsApi("personal").list() });
  const workspaces = useQuery({ queryKey: qk.workspaces("personal"), queryFn: userApi.listWorkspaces });
  const completed = interviews.data?.filter((i) => /complete/i.test(i.status ?? "")).length;

  return (
    <Page className="space-y-8">
      <PageHeader eyebrow="Individual" title={`Welcome back, ${user.name.split(" ")[0]}`} description="Practice interviews for the roles you're targeting and keep your resume up to date."
        actions={<Button asChild size="sm" data-testid="overview-new-interview-button"><Link to={`${basePath}/interviews/new`}><Plus /> New interview</Link></Button>} />
      {interviews.isSuccess && <NextStep interviews={interviews.data} basePath={basePath} />}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Interviews" value={interviews.data?.length} loading={interviews.isLoading} testId="stat-interviews" />
        <StatCard label="Completed" value={completed} loading={interviews.isLoading} testId="stat-completed" />
        <StatCard label="Workspaces" value={workspaces.data?.length} loading={workspaces.isLoading} testId="stat-workspaces" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Recent interviews" actions={<Link to={`${basePath}/interviews`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">View all <ArrowRight className="h-3 w-3" /></Link>}>
          <RecentInterviews query={interviews} basePath={basePath} emptyAction={<Button asChild size="sm" variant="outline"><Link to={`${basePath}/interviews/new`}><Plus /> New interview</Link></Button>} />
        </Panel>
        <div className="space-y-6">
          <Panel title="By status">{interviews.isSuccess ? <StatusBreakdown items={interviews.data} /> : <p className="text-sm text-muted-foreground">—</p>}</Panel>
          <Link to={`${basePath}/resume`} className="group flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/40" data-testid="overview-resume-link">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1"><p className="text-sm font-medium">Resume</p><p className="text-xs text-muted-foreground">Upload or replace your resume</p></div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link to={`${basePath}/interviews`} className="group flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/40">
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1"><p className="text-sm font-medium">All interviews</p><p className="text-xs text-muted-foreground">Search and review details</p></div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </Page>
  );
}
