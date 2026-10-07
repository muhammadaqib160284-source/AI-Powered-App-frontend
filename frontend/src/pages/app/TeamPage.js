import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, Loader2, Minus, UserMinus, UserPlus, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Page, PageHeader, Panel } from "@/components/common/Page";
import { InlineError } from "@/components/common/States";
import { RoleBadge } from "@/components/common/Badges";
import { organizationApi } from "@/api/organization";
import { PERMISSION_MATRIX, ROLES, ROLE_SUMMARY, can } from "@/lib/permissions";
import { useAppContext } from "@/hooks/useAppContext";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmailField({ id, value, onChange, error }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Email</Label>
      <Input id={id} type="email" value={value} onChange={(e) => onChange(e.target.value)} placeholder="teammate@company.com" data-testid={`${id}-input`} aria-invalid={!!error} />
      {error && <p className="text-xs text-destructive" data-testid={`${id}-error`}>{error}</p>}
    </div>
  );
}

function RoleField({ id, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Role</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} data-testid={`${id}-select`}><SelectValue /></SelectTrigger>
        <SelectContent>
          {ROLES.map((r) => <SelectItem key={r} value={r} data-testid={`${id}-option-${r}`}>{r}</SelectItem>)}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">{ROLE_SUMMARY[value]}</p>
    </div>
  );
}

function useEmailForm(mutationFn, successMsg, withRole = true) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("HR");
  const [error, setError] = useState(null);
  const mutation = useMutation({ mutationFn, onSuccess: () => { toast.success(successMsg); setEmail(""); } });
  const validate = () => {
    const err = EMAIL.test(email.trim()) ? null : "Enter a valid email address";
    setError(err);
    return !err;
  };
  return { email, setEmail: (v) => { setEmail(v); setError(null); }, role, setRole, error, validate, mutation, values: withRole ? { email, role } : { email } };
}

function InviteForm() {
  const f = useEmailForm(organizationApi.invite, "Invitation sent");
  return (
    <Panel title="Invite a member" description="They'll receive an invitation to join with the selected role." testId="invite-member-panel">
      <form noValidate onSubmit={(e) => { e.preventDefault(); f.validate() && f.mutation.mutate(f.values); }} className="space-y-4">
        <EmailField id="invite-email" value={f.email} onChange={f.setEmail} error={f.error} />
        <RoleField id="invite-role" value={f.role} onChange={f.setRole} />
        <InlineError error={f.mutation.error} testId="invite-error" />
        <Button type="submit" disabled={f.mutation.isPending} data-testid="invite-submit-button">
          {f.mutation.isPending ? <Loader2 className="animate-spin" /> : <UserPlus />} Send invitation
        </Button>
      </form>
    </Panel>
  );
}

function ChangeRoleForm() {
  const f = useEmailForm(organizationApi.updateMemberRole, "Member role updated");
  return (
    <Panel title="Change a member's role" description="Applies immediately to the member's next request." testId="change-role-panel">
      <form noValidate onSubmit={(e) => { e.preventDefault(); f.validate() && f.mutation.mutate(f.values); }} className="space-y-4">
        <EmailField id="change-role-email" value={f.email} onChange={f.setEmail} error={f.error} />
        <RoleField id="change-role-role" value={f.role} onChange={f.setRole} />
        <InlineError error={f.mutation.error} testId="change-role-error" />
        <Button type="submit" variant="secondary" disabled={f.mutation.isPending} data-testid="change-role-submit-button">
          {f.mutation.isPending ? <Loader2 className="animate-spin" /> : <UserCog />} Update role
        </Button>
      </form>
    </Panel>
  );
}

function RemoveMemberForm() {
  const f = useEmailForm(organizationApi.removeMember, "Member removed", false);
  const [confirming, setConfirming] = useState(false);
  return (
    <Panel title="Remove a member" description="Revokes the member's role and access to this organization." testId="remove-member-panel">
      <form noValidate onSubmit={(e) => { e.preventDefault(); f.validate() && setConfirming(true); }} className="space-y-4">
        <EmailField id="remove-member-email" value={f.email} onChange={f.setEmail} error={f.error} />
        <InlineError error={f.mutation.error} testId="remove-member-error" />
        <Button type="submit" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={f.mutation.isPending} data-testid="remove-member-submit-button">
          {f.mutation.isPending ? <Loader2 className="animate-spin" /> : <UserMinus />} Remove member
        </Button>
      </form>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent data-testid="remove-member-confirm-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {f.email.trim()}?</AlertDialogTitle>
            <AlertDialogDescription>They'll lose access to this organization's interviews and workspaces. You can invite them again later.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="remove-member-cancel-button">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => f.mutation.mutate(f.values)} data-testid="remove-member-confirm-button">
              Remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Panel>
  );
}

function PermissionMatrix() {
  return (
    <Panel title="Role permissions" description="What each role can do in this organization." testId="permission-matrix">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 font-medium text-muted-foreground">Capability</th>
              {ROLES.map((r) => <th key={r} className="pb-2 text-center"><RoleBadge role={r} /></th>)}
            </tr>
          </thead>
          <tbody>
            {PERMISSION_MATRIX.map((p) => (
              <tr key={p.action} className="border-b last:border-0">
                <td className="py-2.5 pr-4">{p.label}</td>
                {ROLES.map((r) => (
                  <td key={r} className="text-center">
                    {can("organization", r, p.action) ? <Check className="mx-auto h-4 w-4 text-success" aria-label="Allowed" /> : <Minus className="mx-auto h-4 w-4 text-muted-foreground/50" aria-label="Not allowed" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export default function TeamPage() {
  const { contextName } = useAppContext();
  return (
    <Page>
      <PageHeader eyebrow={contextName} title="Team & access" description="Invite people to this organization and manage their roles. Members are identified by email." />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <InviteForm />
        <ChangeRoleForm />
        <RemoveMemberForm />
        <PermissionMatrix />
      </div>
    </Page>
  );
}
