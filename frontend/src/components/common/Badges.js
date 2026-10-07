import { cn } from "@/lib/utils";
import { humanize } from "@/lib/format";

const TONES = [
  { re: /(complete|done|finish|pass|accept|success)/i, cls: "bg-success/10 text-success border-success/20", dot: "bg-success" },
  { re: /(progress|active|live|ongoing|started|running)/i, cls: "bg-info/10 text-info border-info/20", dot: "bg-info" },
  { re: /(pending|scheduled|created|invited|draft|waiting|new)/i, cls: "bg-warning/10 text-warning border-warning/20", dot: "bg-warning" },
  { re: /(cancel|fail|expire|reject|error|abandon)/i, cls: "bg-destructive/10 text-destructive border-destructive/20", dot: "bg-destructive" },
];

export function StatusBadge({ status, className, testId }) {
  if (!status) return null;
  const tone = TONES.find((t) => t.re.test(status)) ?? { cls: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" };
  return (
    <span
      data-testid={testId}
      className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium font-mono", tone.cls, className)}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
      {humanize(status)}
    </span>
  );
}

export function RoleBadge({ role, className }) {
  if (!role) return null;
  const cls = {
    ADMIN: "text-primary border-primary/30 bg-primary/10",
    HR: "text-info border-info/30 bg-info/10",
    VIEWER: "text-muted-foreground border-border bg-muted",
  }[role];
  return (
    <span className={cn("inline-flex rounded border px-1.5 py-px font-mono text-[10px] font-medium tracking-wide", cls, className)}>
      {role}
    </span>
  );
}
