import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Page, PageHeader, Panel } from "@/components/common/Page";
import { InlineError } from "@/components/common/States";
import { organizationApi } from "@/api/organization";

export default function InvitationsPage() {
  const [params] = useSearchParams();
  const [token, setToken] = useState(params.get("token") ?? "");
  const [touched, setTouched] = useState(false);
  const mutation = useMutation({ mutationFn: organizationApi.acceptInvitation, onSuccess: () => toast.success("Invitation accepted") });
  const invalid = !token.trim();

  return (
    <Page>
      <PageHeader eyebrow="Individual" title="Accept an invitation" description="Join an organization using the invitation code you received by email." />
      <div className="mt-8 max-w-xl">
        {mutation.isSuccess ? (
          <div className="fade-up rounded-lg border border-success/30 bg-card p-5" data-testid="invitation-accepted">
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium">You've joined the organization</p>
                <p className="mt-1 text-sm text-muted-foreground">It will appear in your profile menu the next time your session refreshes.</p>
              </div>
            </div>
          </div>
        ) : (
          <Panel title="Invitation code" description="Paste the code from your invitation email.">
            <form noValidate className="space-y-4" onSubmit={(e) => { e.preventDefault(); setTouched(true); if (!invalid) mutation.mutate({ token }); }}>
              <div className="space-y-1.5">
                <Label htmlFor="invitation-token">Code</Label>
                <Input id="invitation-token" value={token} onChange={(e) => setToken(e.target.value)} className="font-mono" placeholder="inv_…" data-testid="invitation-token-input" aria-invalid={touched && invalid} />
                {touched && invalid && <p className="text-xs text-destructive" data-testid="invitation-token-error">Enter your invitation code.</p>}
              </div>
              <InlineError error={mutation.error} testId="accept-invitation-error" />
              <Button type="submit" disabled={mutation.isPending} data-testid="accept-invitation-submit-button">
                {mutation.isPending && <Loader2 className="animate-spin" />} Accept invitation
              </Button>
            </form>
          </Panel>
        )}
      </div>
    </Page>
  );
}
