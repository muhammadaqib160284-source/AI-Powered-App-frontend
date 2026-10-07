import { useNavigate } from "react-router-dom";
import { Check, ChevronsUpDown, Globe, MailOpen, User } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleBadge } from "@/components/common/Badges";
import { useSession } from "@/lib/session";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

function Monogram({ label, className }) {
  return (
    <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-md border bg-secondary text-[11px] font-semibold", className)}>
      {initials(label)}
    </span>
  );
}

function ContextItem({ label, sub, active, onSelect, testId, children }) {
  return (
    <DropdownMenuItem onSelect={onSelect} data-testid={testId} className="gap-3 py-2" aria-current={active || undefined}>
      {children}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm">{label}</span>
        {sub}
      </span>
      {active && <Check className="h-4 w-4 text-primary" />}
    </DropdownMenuItem>
  );
}

export function ContextSwitcher() {
  const { user, memberships, activeContext, activeMembership } = useSession();
  const navigate = useNavigate();
  const isPersonal = activeContext.type === "personal";

  const switchTo = (path, name) => {
    navigate(path);
    toast(`Switched to ${name}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-testid="context-switcher-trigger"
          className="flex items-center gap-2 rounded-md border bg-card px-1.5 py-1 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {initials(user.name)}
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-[140px] truncate text-xs font-medium" data-testid="active-context-name">
              {isPersonal ? "Individual" : activeMembership?.name}
            </span>
            <span className="block text-[10px] text-muted-foreground">{isPersonal ? "Personal" : activeMembership?.role}</span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72" data-testid="context-switcher-menu">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="eyebrow py-1">Personal</DropdownMenuLabel>
        <ContextItem label="Individual" active={isPersonal} testId="context-option-individual" onSelect={() => switchTo("/app/personal", "Individual")}
          sub={<span className="text-[11px] text-muted-foreground">Your own interviews and resume</span>}>
          <span className="grid h-7 w-7 place-items-center rounded-md border bg-secondary"><User className="h-3.5 w-3.5" /></span>
        </ContextItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="eyebrow py-1">Organizations</DropdownMenuLabel>
        <DropdownMenuGroup>
          {memberships.length === 0 && <p className="px-2 py-2 text-xs text-muted-foreground">You're not a member of any organization yet.</p>}
          {memberships.map((m) => (
            <ContextItem
              key={m.tenantId}
              label={m.name}
              active={activeMembership?.tenantId === m.tenantId}
              testId={`context-option-${m.tenantId}`}
              onSelect={() => switchTo(`/app/org/${m.tenantId}`, m.name)}
              sub={<RoleBadge role={m.role} className="mt-0.5" />}
            >
              <Monogram label={m.name} />
            </ContextItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate("/app/personal/invitations")} data-testid="menu-accept-invitation">
          <MailOpen className="h-4 w-4" /> Accept an invitation
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate("/")} data-testid="menu-back-to-site">
          <Globe className="h-4 w-4" /> Back to website
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
