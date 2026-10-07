import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Boxes, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Page, PageHeader } from "@/components/common/Page";
import { EmptyState, ErrorState, InlineError } from "@/components/common/States";
import { userApi } from "@/api/user";
import { organizationApi } from "@/api/organization";
import { qk } from "@/lib/queryKeys";
import { formatDate, initials } from "@/lib/format";
import { useAppContext } from "@/hooks/useAppContext";

export const workspaceApiFor = (scope) => (scope === "organization" ? organizationApi : userApi);

function CreateWorkspaceDialog({ open, onOpenChange }) {
  const { scope, tenantId } = useAppContext();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = !name.trim() || name.trim().length > 80;
  const mutation = useMutation({
    mutationFn: () => workspaceApiFor(scope).createWorkspace({ name }),
    onSuccess: () => {
      toast.success("Workspace created");
      queryClient.invalidateQueries({ queryKey: qk.workspaces(scope, tenantId) });
      setName("");
      setTouched(false);
      onOpenChange(false);
    },
  });
  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!invalid) mutation.mutate();
  };
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) mutation.reset(); }}>
      <DialogContent data-testid="create-workspace-dialog">
        <form onSubmit={submit} noValidate className="space-y-5">
          <DialogHeader>
            <DialogTitle>New workspace</DialogTitle>
            <DialogDescription>Workspaces group related interviews, such as a team or a hiring track.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="workspace-name">Name</Label>
            <Input id="workspace-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Platform engineering" data-testid="workspace-name-input" aria-invalid={touched && invalid} />
            {touched && invalid && <p className="text-xs text-destructive" data-testid="workspace-name-error">Enter a name up to 80 characters.</p>}
          </div>
          <InlineError error={mutation.error} testId="create-workspace-error" />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="workspace-create-submit-button">
              {mutation.isPending && <Loader2 className="animate-spin" />} Create workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function WorkspacesPage() {
  const { scope, tenantId, can, contextName } = useAppContext();
  const [open, setOpen] = useState(false);
  const query = useQuery({ queryKey: qk.workspaces(scope, tenantId), queryFn: () => workspaceApiFor(scope).listWorkspaces() });
  const canCreate = can("createWorkspace");
  const createBtn = canCreate && <Button size="sm" onClick={() => setOpen(true)} data-testid="open-create-workspace-button"><Plus /> New workspace</Button>;

  return (
    <Page>
      <PageHeader eyebrow={contextName} title="Workspaces" description={scope === "organization" ? "Workspaces in this organization." : "Your personal workspaces."} actions={createBtn} />
      <div className="mt-8">
        {query.isLoading && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="workspaces-loading">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />)}</div>}
        {query.isError && <ErrorState error={query.error} onRetry={query.refetch} testId="workspaces-error" />}
        {query.isSuccess && query.data.length === 0 && (
          <EmptyState icon={Boxes} testId="workspaces-empty" title="No workspaces yet"
            description={canCreate ? "Create a workspace to organize interviews by team or hiring track." : "An admin hasn't created any workspaces yet."}
            action={createBtn} />
        )}
        {query.isSuccess && query.data.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="workspaces-list">
            {query.data.map((w, idx) => (
              <li key={w.id ?? idx} className="fade-up rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20" style={{ animationDelay: `${idx * 40}ms` }} data-testid="workspace-card">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-xs font-semibold">{initials(w.name ?? "W")}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{w.name ?? "Unnamed workspace"}</p>
                    {formatDate(w.createdAt) && <p className="text-xs text-muted-foreground">Created {formatDate(w.createdAt)}</p>}
                  </div>
                </div>
                {w.id && <p className="mt-3 truncate font-mono text-[11px] text-muted-foreground">{w.id}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
      {canCreate && <CreateWorkspaceDialog open={open} onOpenChange={setOpen} />}
    </Page>
  );
}
