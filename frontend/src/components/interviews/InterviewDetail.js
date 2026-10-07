import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, Eye, Mail, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/Badges";
import { CopyButton } from "@/components/common/CopyButton";
import { EmptyState, ErrorState } from "@/components/common/States";
import { interviewsApi } from "@/api/interviews";
import { interviewLinkToken } from "@/api/fieldMap";
import { qk } from "@/lib/queryKeys";
import { formatDate } from "@/lib/format";
import { useAppContext } from "@/hooks/useAppContext";

function Field({ label, children, mono }) {
  if (!children) return null;
  return (
    <div className="min-w-0">
      <dt className="eyebrow mb-1">{label}</dt>
      <dd className={mono ? "break-all font-mono text-xs" : "text-sm"}>{children}</dd>
    </div>
  );
}

function Section({ title, children, testId }) {
  return (
    <section className="rounded-lg border bg-card p-5" data-testid={testId}>
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 p-6 lg:p-8" data-testid="interview-detail-loading">
      <Skeleton className="h-7 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

function Actions({ interview }) {
  const { scope, basePath, can } = useAppContext();
  const token = interviewLinkToken(interview.interviewLink);
  const roomHref = scope === "personal" ? interview.slug && `${basePath}/interviews/${interview.slug}/room` : token && `${basePath}/room/${token}`;
  return (
    <div className="flex flex-wrap gap-2">
      {interview.interviewLink && <CopyButton value={interview.interviewLink} label="Copy link" testId="copy-interview-link-button" />}
      {roomHref && can("openInterviewRoom") && (
        <Button asChild size="sm" data-testid="open-interview-room-button">
          <Link to={roomHref}><PlayCircle /> {scope === "personal" ? "Start interview" : "Open room"}</Link>
        </Button>
      )}
      {!can("createInterview") && (
        <span className="inline-flex items-center gap-1.5 rounded-md border px-2.5 text-xs text-muted-foreground" data-testid="read-only-indicator">
          <Eye className="h-3.5 w-3.5" /> Read-only
        </span>
      )}
    </div>
  );
}

export function InterviewDetail({ slug, placeholder, onBack }) {
  const { scope, tenantId } = useAppContext();
  const query = useQuery({
    queryKey: qk.interview(scope, tenantId, slug),
    queryFn: () => interviewsApi(scope).get(slug),
    placeholderData: placeholder,
  });

  if (query.isLoading) return <DetailSkeleton />;
  if (query.isError && !query.data) {
    const notFound = query.error?.status === 404;
    return (
      <div className="p-6 lg:p-8">
        {notFound ? <EmptyState testId="interview-not-found" title="Interview not found" description="It may have been removed, or the link is incorrect." />
          : <ErrorState error={query.error} onRetry={query.refetch} testId="interview-detail-error" />}
      </div>
    );
  }
  const i = query.data;
  const created = formatDate(i.createdAt, "MMM d, yyyy · h:mm a");

  return (
    <article className="fade-up space-y-6 p-6 lg:p-8" data-testid="interview-detail" key={slug}>
      <Button variant="ghost" size="sm" className="-ml-2 lg:hidden" onClick={onBack} data-testid="interview-detail-back-button">
        <ArrowLeft /> All interviews
      </Button>
      <header className="flex flex-col gap-4 border-b pb-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={i.status} testId="interview-detail-status" />
            {created && <span className="text-xs text-muted-foreground">Created {created}</span>}
          </div>
          <h2 className="text-xl font-semibold sm:text-2xl" data-testid="interview-detail-title">{i.title ?? "Untitled interview"}</h2>
          {(i.role || i.companyName) && <p className="text-sm text-muted-foreground">{[i.role, i.companyName].filter(Boolean).join(" at ")}</p>}
        </div>
        <Actions interview={i} />
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        {scope === "organization" && (
          <Section title="Candidate" testId="interview-candidate-section">
            {i.candidateEmail ? (
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-secondary"><Mail className="h-4 w-4" /></span>
                <div className="min-w-0">
                  <p className="eyebrow">Email</p>
                  <a href={`mailto:${i.candidateEmail}`} className="truncate text-sm hover:underline" data-testid="interview-candidate-email">{i.candidateEmail}</a>
                </div>
              </div>
            ) : <p className="text-sm text-muted-foreground">No candidate information returned.</p>}
          </Section>
        )}
        <Section title="Position" testId="interview-position-section">
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Role">{i.role}</Field>
            <Field label="Company">{i.companyName && <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-muted-foreground" />{i.companyName}</span>}</Field>
          </dl>
        </Section>
      </div>

      <Section title="Skills being assessed" testId="interview-skills-section">
        {i.skills.length ? (
          <ul className="flex flex-wrap gap-2">
            {i.skills.map((s) => <li key={s} className="rounded-md border bg-secondary/60 px-2.5 py-1 text-xs font-medium">{s}</li>)}
          </ul>
        ) : <p className="text-sm text-muted-foreground">No skills listed.</p>}
      </Section>

      <Section title="Description" testId="interview-description-section">
        {i.description ? <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{i.description}</p>
          : <p className="text-sm text-muted-foreground">No description provided.</p>}
      </Section>

      <Section title="Interview access" testId="interview-access-section">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label="Interview link" mono>{i.interviewLink}</Field>
          <Field label="Reference" mono>{i.slug}</Field>
        </dl>
        {!i.interviewLink && scope === "organization" && <p className="mt-3 text-xs text-muted-foreground">No interview link was returned for this interview.</p>}
      </Section>
    </article>
  );
}
