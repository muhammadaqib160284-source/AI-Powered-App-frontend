import { Mail, Search } from "lucide-react";
import { StatusBadge } from "@/components/common/Badges";
import { PREVIEW_DETAIL, PREVIEW_INTERVIEWS } from "@/mocks/landingPreview";
import { cn } from "@/lib/utils";

export function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/20" data-testid="landing-product-preview" aria-label="Product preview" role="img">
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="ml-3 truncate font-mono text-[11px] text-muted-foreground">app.candor.so/org/acme/interviews</span>
      </div>
      <div className="grid md:grid-cols-[300px_1fr]">
        <div className="border-b md:border-b-0 md:border-r">
          <div className="border-b p-3">
            <div className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground"><Search className="h-3.5 w-3.5" /> Search interviews</div>
          </div>
          <ul className="space-y-0.5 p-2">
            {PREVIEW_INTERVIEWS.map((i, idx) => (
              <li key={i.slug} className={cn("relative rounded-md px-3 py-2.5", idx === 0 && "bg-accent")}>
                {idx === 0 && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" />}
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium">{i.title}</p>
                  <StatusBadge status={i.status} />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span className="font-mono">{i.candidate}</span><span>{i.date}</span></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden space-y-4 p-6 md:block">
          <StatusBadge status="completed" />
          <div>
            <p className="text-lg font-semibold">{PREVIEW_DETAIL.title}</p>
            <p className="text-xs text-muted-foreground">{PREVIEW_DETAIL.company}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border p-3">
              <p className="eyebrow mb-1">Candidate</p>
              <p className="flex items-center gap-1.5 text-xs"><Mail className="h-3 w-3" /> {PREVIEW_DETAIL.candidate}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="eyebrow mb-1">Round</p>
              <p className="text-xs">Structured first round · 30 min</p>
            </div>
          </div>
          <div className="rounded-md border p-3">
            <p className="eyebrow mb-2">Skills assessed</p>
            <div className="flex flex-wrap gap-1.5">{PREVIEW_DETAIL.skills.map((s) => <span key={s} className="rounded border bg-secondary/60 px-2 py-0.5 text-[11px]">{s}</span>)}</div>
          </div>
          <div className="rounded-md border p-3">
            <p className="eyebrow mb-1">Description</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{PREVIEW_DETAIL.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
