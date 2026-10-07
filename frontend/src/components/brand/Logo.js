import { cn } from "@/lib/utils";

export function Logo({ className, showWord = true }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)} data-testid="brand-logo">
      <span className="relative grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M17 6.5A7 7 0 1 0 17 17.5" />
          <path d="M12 9v6" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
      </span>
      {showWord && <span className="text-[15px]">Candor</span>}
    </span>
  );
}
