import { cn } from "@/lib/utils";

export function PageHeader({ eyebrow, title, description, actions, className }) {
  return (
    <div className={cn("flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between fade-up", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold sm:text-[28px]" data-testid="page-title">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Page({ children, className }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10", className)}>{children}</div>;
}

export function Panel({ title, description, children, className, actions, testId }) {
  return (
    <section data-testid={testId} className={cn("rounded-lg border bg-card", className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}
