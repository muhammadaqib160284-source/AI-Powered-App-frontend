import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { RoleBadge } from "@/components/common/Badges";
import { ContextSwitcher } from "@/components/layout/ContextSwitcher";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

function SidebarContent({ nav, contextName, role, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-5">
        <Link to="/" aria-label="Candor home"><Logo /></Link>
      </div>
      <div className="px-3 pt-4">
        <div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2.5" data-testid="sidebar-context-card">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-xs font-semibold">{initials(contextName)}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{contextName}</p>
            {role ? <RoleBadge role={role} /> : <p className="text-[11px] text-muted-foreground">Personal context</p>}
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-4" aria-label="Main">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            data-testid={`nav-${item.id}`}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      {role && (
        <div className="m-3 flex gap-2 rounded-md border border-dashed p-3 text-[11px] leading-relaxed text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          Actions are shown for your role. Every request is verified by the server.
        </div>
      )}
    </div>
  );
}

export function AppShell({ nav, contextName, role, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar lg:block" data-testid="app-sidebar">
        <SidebarContent nav={nav} contextName={contextName} role={role} />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent nav={nav} contextName={contextName} role={role} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation" data-testid="mobile-nav-toggle">
            <Menu />
          </Button>
          <div className="min-w-0 flex-1 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Workspace / </span>
            <span className="font-medium text-foreground" data-testid="topbar-context-name">{contextName}</span>
          </div>
          <ThemeToggle />
          <ContextSwitcher />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
