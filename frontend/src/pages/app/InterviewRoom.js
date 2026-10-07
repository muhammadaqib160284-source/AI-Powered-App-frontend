import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Page } from "@/components/common/Page";
import { StatusBadge } from "@/components/common/Badges";
import { InlineError } from "@/components/common/States";
import { RecordingUpload } from "@/components/interviews/RecordingUpload";
import { RealtimeInterviewBoundary } from "@/realtime/RealtimeInterviewBoundary";
import { interviewsApi } from "@/api/interviews";
import { uploadVideoMultipart } from "@/lib/videoUpload";
import { qk } from "@/lib/queryKeys";
import { useAppContext } from "@/hooks/useAppContext";

function SessionCard({ mutation }) {
  const state = mutation.isSuccess ? "Session ready" : mutation.isPending ? "Starting" : mutation.isError ? "Failed" : "Not started";
  return (
    <div className="rounded-lg border bg-card p-5" data-testid="session-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Session</p>
        <StatusBadge status={state} testId="session-state" />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Starting creates an interview session on the server. The realtime interviewer connects to it.</p>
      <div className="mt-4 space-y-3">
        <InlineError error={mutation.error} testId="session-error" />
        {!mutation.isSuccess && (
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} data-testid="start-session-button">
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Play />} {mutation.isError ? "Try again" : "Start session"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Room({ sessionId, interview, header, backHref }) {
  const { scope } = useAppContext();
  const api = interviewsApi(scope);
  const mutation = useMutation({ mutationFn: () => api.startSession(sessionId) });
  return (
    <Page className="space-y-6" >
      <div data-testid="interview-room">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4"><Link to={backHref} data-testid="room-back-link"><ArrowLeft /> Back</Link></Button>
        {header}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RealtimeInterviewBoundary scope={scope} session={mutation.data ?? null} interview={interview} sendMessage={api.sendMessage} uploadRecording={uploadVideoMultipart} />
        </div>
        <div className="space-y-6">
          <SessionCard mutation={mutation} />
          <RecordingUpload />
        </div>
      </div>
    </Page>
  );
}

export function PersonalInterviewRoom() {
  const { slug } = useParams();
  const { basePath } = useAppContext();
  const query = useQuery({ queryKey: qk.interview("personal", null, slug), queryFn: () => interviewsApi("personal").get(slug) });
  const i = query.data;
  const header = query.isLoading ? <Skeleton className="h-8 w-72" /> : (
    <div>
      <p className="eyebrow mb-2">Interview room</p>
      <h1 className="text-2xl font-semibold" data-testid="page-title">{i?.title ?? "Interview"}</h1>
      {i && (i.role || i.companyName) && <p className="mt-1 text-sm text-muted-foreground">{[i.role, i.companyName].filter(Boolean).join(" at ")}</p>}
    </div>
  );
  return <Room sessionId={slug} interview={i ?? { slug }} header={header} backHref={`${basePath}/interviews?i=${encodeURIComponent(slug)}`} />;
}

export function OrgInterviewRoom() {
  const { interviewLink } = useParams();
  const { basePath } = useAppContext();
  const header = (
    <div>
      <p className="eyebrow mb-2">Interview room</p>
      <h1 className="text-2xl font-semibold" data-testid="page-title">Candidate interview</h1>
      <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{interviewLink}</p>
    </div>
  );
  return <Room sessionId={interviewLink} interview={{ interviewLink }} header={header} backHref={`${basePath}/interviews`} />;
}
