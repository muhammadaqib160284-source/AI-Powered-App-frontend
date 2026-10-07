import { AlertTriangle, Inbox, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/api/errors";
import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon = Inbox, title, description, action, className, testId = "empty-state" }) {
  return (
    <div data-testid={testId} className={cn("flex flex-col items-start gap-3 rounded-lg border border-dashed p-8", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-md border bg-card text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry, title = "Couldn't load this", className, testId = "error-state" }) {
  return (
    <div data-testid={testId} role="alert" className={cn("flex flex-col items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/5 p-6", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-md bg-destructive/10 text-destructive">
        <AlertTriangle className="h-4 w-4" />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 max-w-md text-sm text-muted-foreground" data-testid={`${testId}-message`}>{getErrorMessage(error)}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} data-testid={`${testId}-retry-button`}>
          <RotateCw /> Try again
        </Button>
      )}
    </div>
  );
}

export function InlineError({ error, testId = "inline-error" }) {
  if (!error) return null;
  return (
    <p role="alert" data-testid={testId} className="flex items-center gap-2 rounded-md border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive">
      <AlertTriangle className="h-4 w-4 shrink-0" /> {getErrorMessage(error)}
    </p>
  );
}
