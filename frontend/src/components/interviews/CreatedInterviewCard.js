import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/Badges";
import { CopyButton } from "@/components/common/CopyButton";

function Row({ label, value, mono }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-4 border-b py-2.5 last:border-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={`col-span-2 break-words text-sm ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}

export function CreatedInterviewCard({ interview, detailHref, onReset }) {
  return (
    <div className="fade-up rounded-lg border border-success/30 bg-card" data-testid="interview-created-card">
      <div className="flex items-start gap-3 border-b p-5">
        <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
        <div>
          <p className="font-medium">Interview created</p>
          <p className="text-sm text-muted-foreground">Here's what the server returned for this interview.</p>
        </div>
      </div>
      <dl className="px-5 py-2">
        <Row label="Title" value={interview.title} />
        <Row label="Status" value={interview.status && <StatusBadge status={interview.status} />} />
        <Row label="Role" value={interview.role} />
        <Row label="Company" value={interview.companyName} />
        <Row label="Candidate" value={interview.candidateEmail} />
        <Row label="Skills" value={interview.skills.length ? interview.skills.join(", ") : null} />
        <Row label="Interview link" value={interview.interviewLink} mono />
        <Row label="Reference" value={interview.slug} mono />
      </dl>
      <div className="flex flex-wrap gap-2 border-t p-5">
        {detailHref && <Button asChild size="sm" data-testid="created-view-interview-link"><Link to={detailHref}>View interview</Link></Button>}
        {interview.interviewLink && <CopyButton value={interview.interviewLink} label="Copy link" testId="created-copy-link-button" />}
        <Button variant="ghost" size="sm" onClick={onReset} data-testid="create-another-interview-button">Create another</Button>
      </div>
    </div>
  );
}
