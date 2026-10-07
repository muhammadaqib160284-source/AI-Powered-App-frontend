import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/Badges";
import { EmptyState, ErrorState } from "@/components/common/States";
import { formatDate, humanize } from "@/lib/format";
import { cn } from "@/lib/utils";

function ListSkeleton() {
  return (
    <div className="space-y-1 p-2" data-testid="interview-list-loading">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2 rounded-md p-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function Item({ item, active, onSelect, showCandidate }) {
  return (
    <button
      role="option"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={() => onSelect(item.slug)}
      data-testid={`interview-list-item-${item.slug}`}
      className={cn(
        "relative w-full rounded-md px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        active ? "bg-accent" : "hover:bg-accent/50",
      )}
    >
      {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" />}
      <div className="flex items-start justify-between gap-3">
        <p className="truncate text-sm font-medium">{item.title ?? "Untitled interview"}</p>
        <StatusBadge status={item.status} />
      </div>
      {(item.role || item.companyName) && (
        <p className="mt-1 truncate text-xs text-muted-foreground">{[item.role, item.companyName].filter(Boolean).join(" · ")}</p>
      )}
      <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        {showCandidate && item.candidateEmail ? <span className="truncate font-mono">{item.candidateEmail}</span> : <span />}
        {formatDate(item.createdAt) && <span className="shrink-0">{formatDate(item.createdAt)}</span>}
      </div>
    </button>
  );
}

export function InterviewList({ query, selectedSlug, onSelect, createHref, showCandidate }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const listRef = useRef(null);
  const items = useMemo(() => query.data ?? [], [query.data]);

  const statuses = useMemo(() => [...new Set(items.map((i) => i.status).filter(Boolean))], [items]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(
      (i) =>
        (status === "all" || i.status === status) &&
        (!q || [i.title, i.role, i.companyName, i.candidateEmail].some((f) => f?.toLowerCase().includes(q))),
    );
  }, [items, search, status]);

  const onKeyDown = (e) => {
    if (!["ArrowDown", "ArrowUp"].includes(e.key) || !filtered.length) return;
    e.preventDefault();
    const idx = filtered.findIndex((i) => i.slug === selectedSlug);
    const next = filtered[Math.max(0, Math.min(filtered.length - 1, idx + (e.key === "ArrowDown" ? 1 : -1)))];
    onSelect(next.slug);
    requestAnimationFrame(() => listRef.current?.querySelector('[aria-selected="true"]')?.focus());
  };

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold" data-testid="page-title">Interviews</h1>
          <span className="font-mono text-xs text-muted-foreground" data-testid="interview-count">{query.isSuccess ? `${filtered.length}/${items.length}` : ""}</span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={showCandidate ? "Search title, role, candidate…" : "Search title, role, company…"} className="pl-8" data-testid="interview-search-input" aria-label="Search interviews" />
        </div>
        {statuses.length > 0 && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
            {["all", ...statuses].map((s) => (
              <button key={s} onClick={() => setStatus(s)} aria-pressed={status === s} data-testid={`status-filter-${s}`}
                className={cn("rounded-full border px-2.5 py-0.5 text-xs transition-colors", status === s ? "border-foreground/30 bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
                {s === "all" ? "All" : humanize(s)}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {query.isLoading && <ListSkeleton />}
        {query.isError && <div className="p-4"><ErrorState error={query.error} onRetry={query.refetch} testId="interview-list-error" /></div>}
        {query.isSuccess && items.length === 0 && (
          <div className="p-4">
            <EmptyState testId="interview-list-empty" title="No interviews yet" description="Interviews you create will appear here with their status."
              action={createHref && <Button asChild size="sm"><Link to={createHref} data-testid="empty-create-interview-link"><Plus /> New interview</Link></Button>} />
          </div>
        )}
        {query.isSuccess && items.length > 0 && filtered.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground" data-testid="interview-list-no-match">No interviews match your filters.</p>
        )}
        <div ref={listRef} role="listbox" aria-label="Interviews" onKeyDown={onKeyDown} className="space-y-0.5 p-2">
          {filtered.map((item) => (
            <Item key={item.slug ?? item.title} item={item} active={item.slug === selectedSlug} onSelect={onSelect} showCandidate={showCandidate} />
          ))}
        </div>
      </div>
    </div>
  );
}
