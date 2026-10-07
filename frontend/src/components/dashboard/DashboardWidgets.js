import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/Badges";
import { EmptyState, ErrorState } from "@/components/common/States";
import { formatDate, humanize } from "@/lib/format";

export function StatCard({ label, value, loading, hint, testId }) {
  return (
    <div className="rounded-lg border bg-card p-5" data-testid={testId}>
      <p className="eyebrow">{label}</p>
      {loading ? <Skeleton className="mt-3 h-8 w-16" /> : <p className="mt-2 font-mono text-3xl font-medium tracking-tight">{value ?? "—"}</p>}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function StatusBreakdown({ items }) {
  const counts = items.reduce((acc, i) => (i.status ? { ...acc, [i.status]: (acc[i.status] ?? 0) + 1 } : acc), {});
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return <p className="text-sm text-muted-foreground">No status information yet.</p>;
  return (
    <ul className="space-y-3" data-testid="status-breakdown">
      {entries.map(([status, n]) => (
        <li key={status}>
          <div className="mb-1 flex justify-between text-sm"><span>{humanize(status)}</span><span className="font-mono text-muted-foreground">{n}</span></div>
          <div className="h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${(n / items.length) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

export function RecentInterviews({ query, basePath, showCandidate, emptyAction }) {
  if (query.isLoading) return <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}</div>;
  if (query.isError) return <ErrorState error={query.error} onRetry={query.refetch} testId="recent-interviews-error" />;
  if (!query.data.length) return <EmptyState testId="recent-interviews-empty" title="No interviews yet" description="Create your first interview to see it here." action={emptyAction} />;
  return (
    <ul className="divide-y" data-testid="recent-interviews">
      {query.data.slice(0, 6).map((i, idx) => (
        <li key={i.slug ?? idx}>
          <Link to={`${basePath}/interviews${i.slug ? `?i=${encodeURIComponent(i.slug)}` : ""}`} className="group flex items-center gap-4 py-3 text-sm">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{i.title ?? "Untitled interview"}</p>
              <p className="truncate text-xs text-muted-foreground">{showCandidate && i.candidateEmail ? i.candidateEmail : [i.role, i.companyName].filter(Boolean).join(" · ")}</p>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">{formatDate(i.createdAt)}</span>
            <StatusBadge status={i.status} />
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
